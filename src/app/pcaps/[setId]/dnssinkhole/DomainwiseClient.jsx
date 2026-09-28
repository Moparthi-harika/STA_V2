"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DomainMap from "./components/DomainMap";
import DomainPcaps from "./components/DomainPcaps";
import DomainIsp from "./components/DomainIsp";
import DomainIp from "./components/DomainIp";
import IpSearch from "./components/IpSearch";
import { Search, Globe, ChevronRight, Activity } from "lucide-react";
import { Map, FileText, Server, Network } from "lucide-react";
const DOMAIN_TABS = [
  { id: "Map", icon: Map },
  { id: "PCAPs", icon: FileText },
  { id: "ISP", icon: Server },
  { id: "IP", icon: Network },
  { id: "IPSearch", icon: Search },
];

export default function DomainwiseClient({ dnsData, session }) {
  const total_domains = dnsData.length;
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [activeTab, setActiveTab] = useState("Map");
  const [searchDomain, setSearchDomain] = useState("");
  const [selectedIp, setSelectedIp] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const domain = url.pathname.split("/").pop();

    if (domain !== "dnssinkhole") {
      const item = dnsData.find((item) => item.host === domain);

      if (item) {
        setSelectedDomain(item);
      }
    }
  }, [dnsData]);
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const domain = url.pathname.split("/").pop();

      if (domain === "dnssinkhole") {
        setSelectedDomain(null);
      } else {
        const item = dnsData.find((item) => item.host === domain);

        if (item) {
          setSelectedDomain(item);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dnsData]);
  useEffect(() => {
    if (selectedDomain) {
      setActiveTab("Map");
      setSelectedIp("");
    }
  }, [selectedDomain]);

  const handleDomainClick = (item) => {
    setSelectedDomain(item);

    const url = new URL(window.location.href);

    // url.pathname = `${url.pathname}/${item.host}`;
    url.pathname = `/pcaps/set-2/dnssinkhole/${item.host}`;
    window.history.pushState({}, "", url);
  };

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.pathname = "/pcaps/set-2/dnssinkhole";
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const filterDomains = dnsData.filter((item) =>
    item.host.toLowerCase().includes(searchDomain.toLowerCase()),
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab != "IPSearch") {
      setSelectedIp("");
    }
  };

  return (
<div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      {!selectedDomain && (
        <>
          <div className="flex items-center justify-between gap-4 px-6 pt-2 pb-4">
            <h1 className="flex items-center gap-3 text-[22px] font-bold tracking-tight text-foreground">
              DNS Sinkhole
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                {total_domains} Domains
              </span>
            </h1>

            <div className="group relative w-full max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500"
              />
              <input
                type="text"
                placeholder="Search domain..."
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                className="w-full rounded-xl border border-theme bg-card py-2.5 pl-10 pr-3 text-[13px] font-medium text-foreground shadow-sm transition-all placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
          {filterDomains.length > 0 ? (
          <div className="mx-6 flex-1 min-h-0 overflow-y-auto border-2 mb-2 border-theme  p-4">
          <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filterDomains.map((item) => (
                <div
                  key={item.host}
                  onClick={() => handleDomainClick(item)}
                  className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-theme bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                    <Globe size={16} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="block truncate text-[13px] font-medium text-foreground"
                      title={item.host}
                    >
                      {item.host}
                    </span>

                    <span className="mt-1  items-center gap-1 text-[11px] text-muted-foreground">
                      {Number(item.request_count).toLocaleString()} requests
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="ml-auto shrink-0 -translate-x-1 text-slate-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
          ) : (
            <div className="mx-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-theme py-16 text-muted-foreground">
              <Search size={22} className="opacity-50" />
              <span className="text-sm">No domains found</span>
            </div>
          )}
        </>
      )}

      {selectedDomain && (
        <>
          <div className="relative mx-8 mb-1 mt-2 flex items-center gap-5 overflow-hidden  border border-theme bg-card px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-pink-500 ring-1 ring-amber-500/20">
              <Globe size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Domain
              </p>
              <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
                {selectedDomain.host}
              </h2>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Requests
              </p>
              <p className="flex items-center gap-1.5 text-lg font-semibold tabular-nums text-green-500">
                <Activity size={15} />
                {Number(selectedDomain.request_count).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleClose}
              title="Close"
              className="group ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white"
            >
              <X
                size={18}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            </button>
          </div>
          <div className="mx-8 flex flex-1 min-h-0 flex-col">
            {/* TOP TABS */}
            <div className="flex items-center bg-card border  border-blue-400/40 bg-slate-50  rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(59,130,246,0.06),0_0_25px_rgba(59,130,246,0.10)] dark:border-blue-400/25 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_0_30px_rgba(59,130,246,0.12)]">
              {DOMAIN_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                        relative flex-1
                        h-14
                        flex items-center justify-center
                        gap-2
                        text-sm
                        font-semibold
                        transition-all duration-200
                        border-r border-theme
                        last:border-r-0
                        ${
                          isActive
                            ? "text-blue-500 bg-blue-500/5"
                            : "text-foreground hover:text-blue-500 hover:bg-blue-500/5"
                        }
                    `}
                  >
                    <Icon
                      size={16}
                      className={
                        isActive ? "text-blue-500" : "text-muted-foreground"
                      }
                    />

                    <span>{tab.id === "IPSearch" ? "IP Search" : tab.id}</span>

                    {isActive && (
                      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONTENT */}
            <div className="mt-1 flex-1 min-h-0 rounded-xl border border-theme bg-card p-4">
              {activeTab === "Map" && (
                <DomainMap
                  selectedDomain={selectedDomain}
                  setActiveTab={setActiveTab}
                  setSelectedIp={setSelectedIp}
                />
              )}

              {activeTab === "PCAPs" && (
                <DomainPcaps selectedDomain={selectedDomain} />
              )}

              {activeTab === "ISP" && (
                <DomainIsp
                  selectedDomain={selectedDomain}
                  session={session}
                  setActiveTab={setActiveTab}
                  setSelectedIp={setSelectedIp}
                />
              )}

              {activeTab === "IP" && (
                <DomainIp
                  selectedDomain={selectedDomain}
                  setActiveTab={setActiveTab}
                  setSelectedIp={setSelectedIp}
                />
              )}

              {activeTab === "IPSearch" && <IpSearch initialIp={selectedIp} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
