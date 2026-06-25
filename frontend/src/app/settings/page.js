"use client";

import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const groups = [
    {
      id: 1,
      items: [
        { name: "Account", icon: "key" },
        { name: "Privacy", icon: "lock" },
        { name: "Avatar", icon: "account_circle" },
      ],
    },
    {
      id: 2,
      items: [
        { name: "Notifications", icon: "notifications" },
        { name: "Storage and Data", icon: "storage" },
        { name: "Appearance", icon: "palette" },
      ],
    },
    {
      id: 3,
      items: [
        { name: "Help", icon: "help" },
        { name: "About", icon: "info" },
      ],
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen text-on-background pb-24 md:pb-8 flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 pt-lg flex-grow">
        {/* Header */}
        <header className="mb-6">
          <h1 className="font-display-lg text-display-lg text-on-surface font-bold">Settings</h1>
        </header>

        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors duration-200 border border-outline-variant/30">
          <div className="flex items-center gap-4">
            <img
              className="w-16 h-16 rounded-full object-cover bg-surface-variant"
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZuBp75iUhroYa9MupTDhfpHJjHb3EPCrzAPbS_iAIYU1morydISw02NuyYapWBVPQ78qsky8zhu4WJknJoeIU4syXtzzEyI3V1IK3EoCriH-Y6tfZdBgGr8Wwm30ROyn2L6SpXSXTZjAD1FEV4KvdH_2kmiLl8MxnMJKu10ZWNTQj8Od8F5JNU3Xl5Upv7ETjn1UrmtslzEuUaka3crd4agoRITNguBu7nuN_a7mtENthhow-WDOYKxmhXACckorow1M0j4sLtcc"
            />
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Alex Mercer</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">+1 (555) 123-4567</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">qr_code_2</span>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30"
            >
              {group.items.map((item, idx) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-4 hover:bg-surface-container transition-colors duration-200 cursor-pointer ${
                    idx < group.items.length - 1 ? "border-b border-surface-variant" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <span className="font-body-lg text-body-lg text-on-surface">{item.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <Navigation activeTab="settings" />
    </div>
  );
}
