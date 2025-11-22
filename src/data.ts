import { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
    {
        id: '1',
        type: 'default',
        data: { label: 'Core Router', status: 'healthy' },
        position: { x: 400, y: 100 },
        style: { background: '#2a2a2a', color: '#fff', border: '2px solid #00ff00', borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
        id: '2',
        type: 'default',
        data: { label: 'Switch A', status: 'critical' },
        position: { x: 200, y: 300 },
        style: { background: '#2a2a2a', color: '#fff', border: '2px solid #ff0000', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }
    },
    {
        id: '3',
        type: 'default',
        data: { label: 'Switch B', status: 'healthy' },
        position: { x: 600, y: 300 },
        style: { background: '#2a2a2a', color: '#fff', border: '2px solid #00ff00', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }
    },
    {
        id: '4',
        type: 'default',
        data: { label: 'Server Cluster', status: 'healthy' },
        position: { x: 400, y: 500 },
        style: { background: '#2a2a2a', color: '#fff', border: '2px solid #00ff00', width: 120, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }
    },
];

export const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ff0000', strokeWidth: 3 } },
    { id: 'e1-3', source: '1', target: '3', animated: false, style: { stroke: '#00ff00', strokeWidth: 1 } },
    { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#ff0000', strokeWidth: 3 } },
    { id: 'e3-4', source: '3', target: '4', animated: false, style: { stroke: '#00ff00', strokeWidth: 1 } },
];

export const nodeLogs: Record<string, string> = {
    '2': `[CRITICAL] Interface Gi0/1: Input errors > 1000
[WARN] CPU Utilization: 98%
[INFO] OSPF: Neighbor 10.0.0.1 Down
[INFO] Spanning Tree: Topology Change Detected
[ERROR] Buffer Overflow on Queue 3`,
    '1': `[INFO] System Uptime: 45 weeks
[INFO] BGP: Session Established with ISP1
[INFO] OSPF: Full Adjacency with Switch B`,
};
