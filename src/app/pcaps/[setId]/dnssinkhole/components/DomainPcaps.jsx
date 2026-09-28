export default function  DomainPcaps({selectedDomain}){
    return(
        <div>
            <h2>PCAP's INFO</h2>
            <p>
                Connected PCAP's : {selectedDomain.pcap_ids.length}
            </p>
            <div className="mt-4 flex flex-col gap-2">
                {selectedDomain.pcap_ids.map((item)=>(
                    <div 
                    key = {item}
                     className="border border-theme rounded-lg px-4 py-3 bg-card"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}