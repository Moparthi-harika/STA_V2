
export default function DomainSidebar({ activeTab, setActiveTab }){
    return(
        <div className="flex flex-col gap-1">
            <div 
                onClick={()=>{setActiveTab("Map")}}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === "Map"
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted"
                }`}
                
            >
                Map
            </div>
            <div onClick={()=>{setActiveTab("PCAPs")}}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === "PCAPs"
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted"
                }`}

                >PCAPs</div>
            <div onClick={()=>{setActiveTab("ISP")}}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === "ISP"
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted"
                }`}
                >ISP</div>
            <div onClick={()=>{setActiveTab("IP")}}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === "IP"
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted"
                }`}
                >IP</div>
            <div onClick={()=>{setActiveTab("IPSearch")}}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === "IPSearch"
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted"
                }`}
                >IPSearch</div>

        </div>
    )
}