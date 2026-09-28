export default function DomainIsp({ selectedDomain }) {
    return (
        <div>
            <h2>ISP Information</h2>

            <p>
                Connected IPs: {selectedDomain.connected_ips.length}
            </p>
            <div className="mt-4 flex flex-col gap-2">
                {selectedDomain.connected_ips.map((item) => (
                <div
                    key={item.ip}
                    className="border border-theme rounded-lg px-4 py-3 bg-card"
                >
                    {item.ip} — {item.isp}
                </div>
                ))}
            </div>

        </div>
    );
}