import React, { useState } from "react";
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";



const AdminSideBar = ({ isCollapsed, menuItems, handleMenuClick, activeMenu, toggleSidebar, admin_name, admin_role, admin_avatar_url }) => {
    const [expandedSubmenus, setExpandedSubmenus] = useState([]);
    const toggleSubmenu = (menuId) => {
        setExpandedSubmenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    return (
        <nav
            className={`fixed left-0 top-0 h-screen pt-[80px] md:pt-[40px] bg-gray-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                } shadow-xl z-50`}
            aria-label="Main navigation"
        >
            <div className="flex flex-col h-full">
                <div className="p-5 border-b border-gray-700 flex items-center justify-end">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <div className="w-6 h-0.5 bg-white mb-1"></div>
                        <div className="w-6 h-0.5 bg-white mb-1"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ul className="py-4">
                        {menuItems.map((item) => (
                            <li key={item.id} className="mb-1">
                                <div
                                    className={`relative ${isCollapsed ? "px-2" : "px-4"}`}
                                >
                                    <button
                                        onClick={() => {
                                            handleMenuClick(item.id);
                                            if (item.submenu) toggleSubmenu(item.id);
                                        }}
                                        className={`w-full flex items-center py-3 px-2 rounded-lg transition-colors duration-200 ${activeMenu === item.id
                                            ? "bg-blue-600"
                                            : "hover:bg-gray-700"
                                            }`}
                                        aria-expanded={expandedSubmenus.includes(item.id)}
                                    >
                                        <span className="inline-flex items-center justify-center">
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && (
                                            <>
                                                <span className="ml-3 flex-1">{item.title}</span>
                                                {item.submenu && (
                                                    <span className="ml-auto">
                                                        {expandedSubmenus.includes(item.id) ? (
                                                            <BiSolidChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <BiSolidChevronDown className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {!isCollapsed &&
                                        item.submenu &&
                                        expandedSubmenus.includes(item.id) && (
                                            <ul
                                                className="mt-1 ml-8 space-y-1"
                                                role="menu"
                                                aria-label={`${item.title} submenu`}
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.id} role="none">
                                                        <button
                                                            onClick={() => handleMenuClick(subItem.id)}
                                                            className={`w-full text-left py-2 px-3 flex items-center rounded-lg transition-colors duration-200 ${activeMenu === subItem.id
                                                                ? "bg-blue-600"
                                                                : "hover:bg-gray-700"
                                                                }`}
                                                            role="menuitem"
                                                        >
                                                            <span className="mr-4">{subItem.icon}</span>
                                                            {subItem.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                        <img className={`w-8 h-8 rounded-full`} src={admin_avatar_url} alt=""></img>
                        {!isCollapsed && (
                            <div>
                                <p className="text-sm font-medium">{admin_name || "John Doe"}</p>
                                <p className="text-xs text-gray-400">{admin_role || "Administrator"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AdminSideBar;