"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { SiApplepay, SiGooglepay } from "react-icons/si";
import { MdCreditCard } from "react-icons/md";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export default function CartsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [warning, setWarning] = useState<string>("");
  const [shipping, setShipping] = useState<number>(4.99);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(stored);
    } catch {
      setWarning("Failed to load cart");
      setCartItems([]);
    }
  }, []);

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    const next = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCartItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const removeItem = (id: string) => {
    const next = cartItems.filter((i) => i.id !== id);
    setCartItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const tax = 27.0;
  const discount = 0.0;
  const total = calculateSubtotal() + tax + shipping - discount;

  if (warning)
    return <div className="min-h-screen flex items-center justify-center">{warning}</div>;

  return (
    <div className="min-h-screen p-5 pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#634bc1] mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/shop/products"
              className="inline-block bg-[#634bc1] text-white px-6 py-2 rounded"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="w-full grid lg:grid-cols-[2fr_1fr] md:grid-cols-1 gap-6">
            {/* --- LEFT SIDE: CART ITEMS --- */}
            <div className="grid grid-cols-1 gap-6 w-full border-1 p-4 rounded-lg border-t-4 border-t-blue-400 bg-white shadow-sm">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 mb-3"
                >
                  {/* Product Image */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Product Info */}
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h2>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center cursor-pointer gap-1 text-gray-500 mt-2 text-sm hover:text-red-600"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Right Section: Price, Quantity, Total */}
                  <div className="flex items-center gap-8">
                    {/* Price */}
                    <p className="text-gray-800 font-semibold">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center border rounded-full">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-gray-700 text-2xl hover:bg-red-400 hover:text-white cursor-pointer rounded-l-full"
                      >
                        -
                      </button>
                      <span className="px-3 text-lg">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-gray-700 text-2xl hover:bg-blue-400 hover:text-white cursor-pointer rounded-r-full"
                      >
                        +
                      </button>
                    </div>

                    {/* Total */}
                    <p className="font-bold text-gray-800 border-b-2 border-blue-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- RIGHT SIDE: ORDER SUMMARY --- */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 border-t-4 border-t-blue-400">
              <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>

              <div className="mb-4">
                <span className="block text-gray-600 mb-2">Shipping</span>
                <div className="space-y-2 text-gray-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === 4.99}
                      onChange={() => setShipping(4.99)}
                      className="accent-blue-600"
                    />
                    Standard Delivery - $4.99
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === 12.99}
                      onChange={() => setShipping(12.99)}
                      className="accent-blue-600"
                    />
                    Express Delivery - $12.99
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === 0}
                      onChange={() => setShipping(0)}
                      className="accent-blue-600"
                    />
                    Free Shipping (Orders over $300)
                  </label>
                </div>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-gray-800">${tax}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Discount</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                  -${discount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
                <span className="font-semibold text-gray-800 text-lg">Total</span>
                <span className="text-lg font-bold text-gray-800 border-b-2 border-blue-500">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full mb-3 flex items-center justify-center gap-2 transition">
                Proceed to Checkout →
              </button>
              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 rounded-full mb-4 flex items-center justify-center gap-2 transition">
                ← Continue Shopping
              </button>

              <div className="border-t pt-4 text-center">
                <p className="text-gray-500 text-sm mb-3">We Accept</p>
                <div className="flex justify-center gap-4 text-2xl text-gray-600">
                  <FaPaypal />
                  <MdCreditCard />
                  <SiApplepay />
                  <SiGooglepay />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
