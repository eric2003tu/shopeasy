"use client";
import React, { useMemo, useState } from 'react';
import { sampleOrders, SampleOrder } from '@/lib/sampleData';
import { 
  FiSearch, 
  FiX, 
  FiChevronDown, 
  FiPackage, 
  FiFileText, 
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
  FiHelpCircle,
  FiDollarSign,
  FiCalendar,
  FiHash
} from 'react-icons/fi';

export default function OrdersPage() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentUserId = 'u1';

  const userOrders = useMemo(() => 
    sampleOrders.filter(order => order.userId === currentUserId), 
    []
  );

  const filtered = useMemo(() => {
    let filteredOrders = userOrders;
    const q = query.trim().toLowerCase();
    
    if (q) {
      filteredOrders = filteredOrders.filter(order => 
        order.id.toLowerCase().includes(q) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(q)
        )
      );
    }

    if (statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    return filteredOrders;
  }, [userOrders, query, statusFilter]);

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { 
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: <FiClock className="w-3 h-3 mr-1" />
      },
      confirmed: { 
        color: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: <FiCheckCircle className="w-3 h-3 mr-1" />
      },
      shipped: { 
        color: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: <FiTruck className="w-3 h-3 mr-1" />
      },
      delivered: { 
        color: 'bg-green-50 text-green-800 border-green-200',
        icon: <FiPackage className="w-3 h-3 mr-1" />
      },
      cancelled: { 
        color: 'bg-red-50 text-red-800 border-red-200',
        icon: <FiX className="w-3 h-3 mr-1" />
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-50 text-gray-800 border-gray-200', icon: null };
    
    const labels = {
      pending: 'Processing',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      all: <FiPackage className="w-4 h-4" />,
      pending: <FiClock className="w-4 h-4" />,
      confirmed: <FiCheckCircle className="w-4 h-4" />,
      shipped: <FiTruck className="w-4 h-4" />,
      delivered: <FiPackage className="w-4 h-4" />,
      cancelled: <FiX className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <FiPackage className="w-4 h-4" />;
  };

  const statusCounts = useMemo(() => {
    const counts = { all: userOrders.length };
    userOrders.forEach(order => {
      counts[order.status as keyof typeof counts] = (counts[order.status as keyof typeof counts] || 0) + 1;
    });
    return counts;
  }, [userOrders]);

  const statusLabels = {
    all: 'All Orders',
    pending: 'Processing',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            Track and manage your purchases
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders or products..."
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{getStatusIcon(status)}</span>
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-1.5 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  {statusCounts[status as keyof typeof statusCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order: SampleOrder) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header - Always Visible */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <FiShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        ORDER {order.id.toUpperCase()}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Placed on {order.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={order.status} />
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        ${order.total.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Total
                      </p>
                    </div>
                    <button 
                      onClick={() => setOpenId(openId === order.id ? null : order.id)}
                      className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      {openId === order.id ? 'Hide' : 'View'}
                      <FiChevronDown className={`ml-1 w-4 h-4 transition-transform ${openId === order.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary - Always Visible */}
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FiPackage className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-gray-300">•</div>
                    <div className="text-gray-600 truncate max-w-xs">
                      {order.items.map(item => item.productName).join(', ')}
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <FiTruck className="w-4 h-4" />
                      <span className="font-medium">Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details - Much More Visible */}
              {openId === order.id && (
                <div className="bg-white border-t-4 border-blue-500">
                  <div className="p-6">
                    {/* Two Column Layout for Better Readability */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Order Items - Wider Column */}
                      <div className="xl:col-span-2">
                        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
                          <FiPackage className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {order.items.length} items
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-12 h-12 bg-white rounded border border-gray-300 flex items-center justify-center flex-shrink-0">
                                  <FiShoppingBag className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-gray-900 text-base mb-1">
                                    {item.productName}
                                  </h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span>${(item.price || 0).toFixed(2)} each</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 text-lg">
                                  ${((item.price || 0) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Information & Actions - Sidebar Style */}
                      <div className="space-y-6">
                        {/* Order Details Card */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                          <div className="flex items-center space-x-2 mb-4">
                            <FiFileText className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiHash className="w-4 h-4" />
                                <span className="font-medium">Order ID</span>
                              </div>
                              <span className="font-mono text-gray-900">{order.id}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span className="font-medium">Order Date</span>
                              </div>
                              <span className="text-gray-900">{order.createdAt}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiDollarSign className="w-4 h-4" />
                                <span className="font-medium">Total Amount</span>
                              </div>
                              <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <FiCheckCircle className="w-4 h-4" />
                                <span className="font-medium">Status</span>
                              </div>
                              <StatusBadge status={order.status} />
                            </div>
                            {order.trackingNumber && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                <div className="flex items-center space-x-2 text-blue-800">
                                  <FiTruck className="w-4 h-4" />
                                  <span className="font-medium">Tracking Number</span>
                                </div>
                                <div className="font-mono text-blue-900 text-sm mt-1">
                                  {order.trackingNumber}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                          <div className="space-y-2">
                            {order.status === 'shipped' && order.trackingNumber && (
                              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
                                <FiTruck className="w-4 h-4" />
                                <span>Track Package</span>
                              </button>
                            )}
                            {order.status === 'delivered' && (
                              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm">
                                <FiCheckCircle className="w-4 h-4" />
                                <span>Leave Review</span>
                              </button>
                            )}
                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm">
                                <FiX className="w-4 h-4" />
                                <span>Cancel Order</span>
                              </button>
                            )}
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                              <FiHelpCircle className="w-4 h-4" />
                              <span>Get Help</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {query || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter terms' 
                    : "You haven't placed any orders yet"}
                </p>
                {(query || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}