import { Node, Edge } from 'reactflow';

// Helper to create a node
const createNode = (id: string, label: string, x: number, y: number, type: 'router' | 'switch' | 'endpoint' = 'router', status: 'healthy' | 'critical' | 'warning' = 'healthy') => ({
    id,
    type: 'default',
    data: { label, status, type },
    position: { x, y },
    style: {
        background: '#1a1a1a',
        color: '#fff',
        border: status === 'critical' ? '2px solid #ff0000' : status === 'warning' ? '2px solid #ffcc00' : '2px solid #00ff00',
        width: type === 'router' ? 60 : 50,
        height: type === 'router' ? 60 : 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: type === 'router' ? '50%' : '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: status === 'critical' ? '0 0 15px #ff0000' : 'none',
    }
});

// Topology based on the provided image
// N1, N2, N3, N4, N5, N6, N7 form a mesh/ring structure
// CE is connected to N1, N2
// Teq nodes are endpoints

export const initialNodes: Node[] = [
    // Core Routers
    createNode('N1', 'N1', 250, 150, 'router'),
    createNode('N2', 'N2', 250, 350, 'router', 'critical'), // Critical node
    createNode('N3', 'N3', 450, 100, 'router'),
    createNode('N4', 'N4', 650, 150, 'router'),
    createNode('N5', 'N5', 650, 350, 'router'),
    createNode('N6', 'N6', 850, 150, 'router'),
    createNode('N7', 'N7', 850, 350, 'router'),

    // CE Node
    createNode('CE', 'CE', 50, 250, 'router'),

    // Teq Endpoints
    createNode('Teq9', 'Teq9', -50, 250, 'endpoint'),
    createNode('Teq1', 'Teq1', 250, 450, 'endpoint'),
    createNode('Teq4', 'Teq4', 650, 50, 'endpoint'),
    createNode('Teq5', 'Teq5', 650, 450, 'endpoint'),
    createNode('Teq6', 'Teq6', 850, 50, 'endpoint'),
];

export const initialEdges: Edge[] = [
    // CE Connections
    { id: 'e-ce-n1', source: 'CE', target: 'N1', animated: true, style: { stroke: '#00ccff' } },
    { id: 'e-ce-n2', source: 'CE', target: 'N2', animated: true, style: { stroke: '#00ccff' } },
    { id: 'e-teq9-ce', source: 'Teq9', target: 'CE', style: { stroke: '#666' } },

    // N1 Connections
    { id: 'e-n1-n2', source: 'N1', target: 'N2', style: { stroke: '#00ff00' } },
    { id: 'e-n1-n3', source: 'N1', target: 'N3', style: { stroke: '#00ff00' } },

    // N2 Connections (Critical links)
    { id: 'e-n2-n3', source: 'N2', target: 'N3', style: { stroke: '#00ff00' } },
    { id: 'e-n2-n4', source: 'N2', target: 'N4', style: { stroke: '#00ff00' } },
    { id: 'e-n2-n5', source: 'N2', target: 'N5', animated: true, style: { stroke: '#ff0000', strokeWidth: 2 } }, // Congested
    { id: 'e-teq1-n2', source: 'Teq1', target: 'N2', style: { stroke: '#666' } },

    // N3 Connections
    { id: 'e-n3-n4', source: 'N3', target: 'N4', style: { stroke: '#00ff00' } },

    // N4 Connections
    { id: 'e-n4-n5', source: 'N4', target: 'N5', style: { stroke: '#00ff00' } },
    { id: 'e-n4-n6', source: 'N4', target: 'N6', style: { stroke: '#00ff00' } },
    { id: 'e-teq4-n4', source: 'Teq4', target: 'N4', style: { stroke: '#666' } },

    // N5 Connections
    { id: 'e-n5-n6', source: 'N5', target: 'N6', style: { stroke: '#00ff00' } },
    { id: 'e-n5-n7', source: 'N5', target: 'N7', style: { stroke: '#00ff00' } },
    { id: 'e-teq5-n5', source: 'Teq5', target: 'N5', style: { stroke: '#666' } },

    // N6 Connections
    { id: 'e-n6-n7', source: 'N6', target: 'N7', style: { stroke: '#00ff00' } },
    { id: 'e-teq6-n6', source: 'Teq6', target: 'N6', style: { stroke: '#666' } },
];

// Logs parsed from ISIS FLEX ALGO CONFIG.txt
export const nodeLogs: Record<string, string> = {
    'N1': `[CONFIG] set system ne-id 9999
[CONFIG] set system login user admin class super-user
[INFO] set interfaces ge-ts11/1 unit 1 family inet address 12.12.1.1/255.255.255.0
[INFO] set protocols isis protocol-instance 0 system-id-host-name R1
[INFO] set protocols isis protocol-instance 0 segment-routing flex-algo 140 advertise FAD_IGP_140
[INFO] set protocols isis protocol-instance 0 interface ge-ts11/1.1 level 2 metric 100`,

    'N2': `[CRITICAL] Interface ge-ts11/2: Packet Loss Detected > 15%
[WARN] CPU Utilization: 92% (Process: isis)
[CONFIG] set system ne-id 9999
[INFO] set interfaces ge-ts11/2 unit 1 family inet address 12.12.1.2/255.255.255.0
[INFO] set protocols isis protocol-instance 0 system-id-host-name R2
[INFO] set protocols isis protocol-instance 0 segment-routing flex-algo 140 advertise FAD_IGP_140
[ERROR] Neighbor 12.12.1.1 (N1) State Change: Up -> Init -> Down`,

    'N3': `[CONFIG] set system ne-id 9999
[INFO] set interfaces ge-ts11/1 unit 1 family inet address 13.13.1.3/255.255.255.0
[INFO] set protocols isis protocol-instance 0 system-id-host-name R3
[INFO] set protocols isis protocol-instance 0 segment-routing flex-algo 140 advertise FAD_IGP_140
[INFO] set protocols isis protocol-instance 0 interface ge-ts11/1.1 level 2 metric 10`,

    'N4': `[CONFIG] set system ne-id 9999
[INFO] set interfaces ge-ts11/1 unit 1 family inet address 14.14.1.4/255.255.255.0
[INFO] set protocols isis protocol-instance 0 system-id-host-name R4
[INFO] set protocols isis protocol-instance 0 segment-routing flex-algo 140
[INFO] set protocols isis protocol-instance 0 interface ge-ts11/1.1 level 2 metric 10`,

    'N6': `[CONFIG] set system ne-id 9999
[INFO] set interfaces ge-ts11/1 unit 1 family inet address 16.16.1.6/255.255.255.0
[INFO] set protocols isis protocol-instance 0 system-id-host-name R6
[INFO] set protocols isis protocol-instance 0 segment-routing flex-algo 140 advertise FAD_IGP_140
[INFO] set protocols isis protocol-instance 0 interface ge-ts11/1.1 level 2 metric 10`,
};
