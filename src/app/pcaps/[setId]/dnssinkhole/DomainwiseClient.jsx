"use client";

import { useState ,useEffect} from "react";
import { X } from "lucide-react";
import DomainSidebar from "./components/DomainSidebar";
import DomainMap from "./components/DomainMap";
import DomainPcaps from "./components/DomainPcaps";
import DomainIsp from "./components/DomainIsp";
import DomainIp from "./components/DomainIp";
import IpSearch from "./components/IpSearch";
import {Search} from "lucide-react";


export default function DomainwiseClient({ dnsData ,session}) {
    const total_domains = dnsData.length;
    const[selectedDomain,setSelectedDomain]=useState(null);
    const[activeTab,setActiveTab]=useState("Map");
    const[searchDomain,setSearchDomain]=useState("");

    

    useEffect(() => {
        const url = new URL(window.location.href);
        const domain = url.pathname.split("/").pop();

        if (domain !== "dnssinkhole") {
            const item = dnsData.find((item) => item.host === domain);

            if(item) {
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

    const handleDomainClick =(item)=>{
        setSelectedDomain(item);

        const url = new URL(window.location.href);

        // url.pathname = `${url.pathname}/${item.host}`;
        url.pathname = `/pcaps/set-2/dnssinkhole/${item.host}`;
        window.history.pushState({}, "", url);
    };
     
    const handleClose =()=>{
        const url = new URL(window.location.href);
        url.pathname = "/pcaps/set-2/dnssinkhole";
        window.history.pushState({},"",url);
        window.dispatchEvent(new PopStateEvent("popstate"));
    }

    const filterDomains = dnsData.filter((item)=>
        item.host.toLowerCase().includes(searchDomain.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-3 pb-10">
        {!selectedDomain &&(
            <>
                <div className="flex flex-row items-center justify-between ">
                    <h1 className="text-[22px] font-bold tracking-tight font-sans text-foreground flex items-center gap-3 ml-6">
                        DNS Sinkhole
                    <span className="text-amber-500 text-sm font-sans  bg-amber-500/10 px-3 py-1 rounded-none border border-amber-500/20">
                     Total Domains : {total_domains} </span>
                    </h1>
                    <div className="relative w-120 mr-3">
                        <Search
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input 
                        type="text"
                        placeholder="Search Domain..."
                        value ={searchDomain}
                        onChange={(e)=>{setSearchDomain(e.target.value)}}
                        className="w-full mr-6 pl-9 pr-3 py-2.5 bg-card border border-theme rounded-none text-[13px] font-medium text-foreground focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-500"
                        />
                    </div>
                </div>
                {filterDomains.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2">
                    {filterDomains.map((item)=>(
                        <div 
                        key ={item.host}
                        onClick={() => handleDomainClick(item)}
                        className="border border-theme rounded-xl p-4 bg-card"
                        >
                            {item.host}
                        </div>
                    ))}
                </div>  
                ) :(
                    <div className="p-6 text-center text-muted-foreground">
                         No domains found
                    </div>
                )}
            </>
        )}
        {selectedDomain &&(
            <>
            <div className="mx-8 px-5 py-4 rounded-xl border border-theme bg-card shadow-sm flex items-center gap-6">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Domain
                    </p>
                    <h2 className="text-xl font-semibold  text-foreground">
                        {selectedDomain.host}
                    </h2>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                         Requests
                    </p>
                     <p className="text-lg font-semibold text-amber-500">
                        {selectedDomain.request_count}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="flex h-14 w-14 shrink-0 ml-auto items-center justify-center rounded-r-2xl border-l border-blue-200/40 bg-rose-500/5 text-rose-500 transition-all hover:bg-rose-500 hover:text-white dark:border-blue-400/15"
                >
                    <X
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-300"
                    />
                </button>
            </div>
            <div className="flex mt-4 mx-4  gap-4">
                {/* side bar */}
                <div className="w-48 shrink-0 border border-theme rounded-xl bg-card p-2">
                    <DomainSidebar     activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                {/* main content  */}
                <div className="flex-1 min-h-[500px] border border-theme rounded-xl bg-card p-4">
                    {activeTab === "Map" && <DomainMap />}
                    {activeTab === "PCAPs" && <DomainPcaps selectedDomain={selectedDomain} />}
                    {activeTab === "ISP" && <DomainIsp selectedDomain={selectedDomain} />}
                    {activeTab === "IP" && <DomainIp />}
                    {activeTab === "IPSearch" && <IpSearch />}
                </div>
            </div>
            </>
        )}

      
    </div>
  );
}