'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

/**
 * ============================================
 * MINDSHIFTR - ADMIN DASHBOARD
 * Real-Time Analytics & Monitoring
 * ============================================
 */

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [realTimeData, setRealTimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Colors for charts
    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

    useEffect(() => {
        fetchDashboardData();
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchRealTimeData();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedTimeframe, autoRefresh]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    action: 'get_overview',
                    timeframe: selectedTimeframe
                })
            });
            const data = await response.json();
            setDashboardData(data.overview);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRealTimeData = async () => {
        try {
            const response = await fetch('/api/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    action: 'get_real_time_data'
                })
            });
            const data = await response.json();
            setRealTimeData(data.realTime);
        } catch (error) {
            console.error('Real-time data fetch error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">MindshiftR Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">Real-time Analytics & Monitoring</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="1h">Last Hour</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                            </select>
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    autoRefresh 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Real-time Status Bar */}
                {realTimeData && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-sm text-gray-600">Active Users: </span>
                                <span className="font-semibold text-gray-900 ml-1">{realTimeData.activeUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">Live Sessions: </span>
                                <span className="font-semibold text-gray-900 ml-1">{realTimeData.currentSessions}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">Response Time: </span>
                                <span className="font-semibold text-gray-900 ml-1">{realTimeData.responseTime}ms</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">System Load: </span>
                                <span className="font-semibold text-gray-900 ml-1">{realTimeData.systemLoad.cpu}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Key Metrics */}
                {dashboardData?.summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.totalUsers.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600">+15% from last month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.activeUsers.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600">+22% engagement</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.averageSessionRating}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600">+8% satisfaction</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Crisis Events</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.crisisEvents}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-sm text-green-600">-12% from last week</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Activity Chart */}
                    {dashboardData?.userActivity?.dailyActiveUsers && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dashboardData.userActivity.dailyActiveUsers.map((value, index) => ({
                                    day: `Day ${index + 1}`,
                                    users: value,
                                    newUsers: dashboardData.userActivity.newUsers[index]
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="users" stackId="1" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#764ba2" fill="#764ba2" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Sentiment Distribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Positive', value: 45 },
                                        { name: 'Neutral', value: 35 },
                                        { name: 'Negative', value: 20 }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'Positive', value: 45 },
                                        { name: 'Neutral', value: 35 },
                                        { name: 'Negative', value: 20 }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Response Time Metrics */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={[
                                { time: '00:00', responseTime: 280 },
                                { time: '04:00', responseTime: 320 },
                                { time: '08:00', responseTime: 450 },
                                { time: '12:00', responseTime: 380 },
                                { time: '16:00', responseTime: 420 },
                                { time: '20:00', responseTime: 350 },
                                { time: '23:59', responseTime: 290 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="responseTime" stroke="#667eea" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Technique Effectiveness */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technique Effectiveness</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { technique: 'Mindfulness', effectiveness: 87, usage: 1450 },
                                { technique: 'CBT', effectiveness: 82, usage: 980 },
                                { technique: 'Breathing', effectiveness: 91, usage: 2100 },
                                { technique: 'Grounding', effectiveness: 85, usage: 780 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="technique" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="effectiveness" fill="#667eea" />
                                <Bar dataKey="usage" fill="#764ba2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Health & Crisis Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* System Health */}
                    {dashboardData?.systemHealth && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                                        <span className="text-sm text-gray-600">{dashboardData.systemHealth.cpu}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dashboardData.systemHealth.cpu}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                                        <span className="text-sm text-gray-600">{dashboardData.systemHealth.memory}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${dashboardData.systemHealth.memory}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                                        <span className="text-sm text-gray-600">{dashboardData.systemHealth.disk}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${dashboardData.systemHealth.disk}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">Network</span>
                                        <span className="text-sm text-gray-600">{dashboardData.systemHealth.network}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${dashboardData.systemHealth.network}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Crisis Metrics */}
                    {dashboardData?.crisisMetrics && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crisis Management</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-2xl font-bold text-red-600">{dashboardData.crisisMetrics.totalCrises}</p>
                                    <p className="text-sm text-gray-600">Total Crises</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{dashboardData.crisisMetrics.resolvedCrises}</p>
                                    <p className="text-sm text-gray-600">Resolved</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{dashboardData.crisisMetrics.averageResponseTime}m</p>
                                    <p className="text-sm text-gray-600">Avg Response</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{(dashboardData.crisisMetrics.escalationRate * 100).toFixed(1)}%</p>
                                    <p className="text-sm text-gray-600">Escalation Rate</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activities */}
                {realTimeData?.recentActivities && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                        <div className="space-y-3">
                            {realTimeData.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${
                                            activity.type === 'user_signup' ? 'bg-green-500' : 
                                            activity.type === 'crisis_resolved' ? 'bg-blue-500' : 'bg-gray-500'
                                        }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{activity.details}</p>
                                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
