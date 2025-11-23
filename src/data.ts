import { Node, Edge } from 'reactflow';

// Helper to create a polished node for Light Mode
const createNode = (id: string, label: string, x: number, y: number, type: 'router' | 'switch' | 'endpoint' = 'router', status: 'healthy' | 'critical' | 'warning' = 'healthy') => ({
    id,
    type: 'default',
    data: { label, status, type },
    position: { x, y },
    style: {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        color: '#0f172a', // Slate 900
        border: status === 'critical' ? '3px solid #ef4444' : status === 'warning' ? '3px solid #eab308' : '3px solid #e2e8f0', // Slate 200
        width: type === 'router' ? 80 : type === 'endpoint' ? 56 : 64,
        height: type === 'router' ? 80 : type === 'endpoint' ? 56 : 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: type === 'router' ? '50%' : type === 'endpoint' ? '50%' : '16px',
        fontSize: type === 'router' ? '14px' : '12px',
        fontWeight: '700',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        zIndex: 10,
        letterSpacing: '0.025em',
    }
});

// Topology based on uploaded_image_1_1763811162211.png
// Positions significantly spread out to fill the viewport
export const initialNodes: Node[] = [
    // Core Routers - much more spread out
    createNode('N1', 'N1', 500, 300, 'router'),
    createNode('N2', 'N2', 500, 900, 'router'),
    createNode('N3', 'N3', 900, 200, 'router'),
    createNode('N4', 'N4', 1300, 300, 'router'),
    createNode('N5', 'N5', 1300, 900, 'router'),
    createNode('N6', 'N6', 1700, 300, 'router'),
    createNode('N7', 'N7', 1700, 900, 'router'),

    // CE Node (Left Center)
    createNode('CE', 'CE', 200, 600, 'router'),

    // Teq Endpoints
    createNode('Teq9', 'Teq9', 0, 600, 'endpoint'), // Left of CE
    createNode('Teq1', 'Teq1', 500, 1100, 'endpoint'), // Below N2
    createNode('Teq4', 'Teq4', 1300, 100, 'endpoint'),  // Above N4
    createNode('Teq5', 'Teq5', 1300, 1100, 'endpoint'), // Below N5
    createNode('Teq6', 'Teq6', 1700, 100, 'endpoint'),  // Above N6
];

// Edges with Flex Algo Slicing
// Algo 128 (IGP - Green)
// Algo 129 (Blue - EVPN PA)
// Algo 130 (Orange - EVPN AA)
// Traffic Flow (Dark Slate - Active Path)

const commonEdgeStyle = { strokeWidth: 2.5, opacity: 0.5 };
const activeEdgeStyle = {
    strokeWidth: 4,
    opacity: 1,
    stroke: '#0f172a',
    filter: 'drop-shadow(0 0 6px rgba(15, 23, 42, 0.4))'
};

export const initialEdges: Edge[] = [
    // --- Traffic Flow Path (Teq9 -> CE -> N1 -> N5) ---
    // Highlighting this specific path as requested
    { id: 'flow-1', source: 'Teq9', target: 'CE', animated: true, style: activeEdgeStyle, zIndex: 20 },
    { id: 'flow-2', source: 'CE', target: 'N1', animated: true, style: activeEdgeStyle, zIndex: 20 },
    { id: 'flow-3', source: 'N1', target: 'N5', animated: true, style: activeEdgeStyle, zIndex: 20 },

    // --- Flex Algo 128 (Standard IGP - Green) ---
    { id: 'e-n1-n2', source: 'N1', target: 'N2', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n1-n3', source: 'N1', target: 'N3', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n2-n3', source: 'N2', target: 'N3', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n2-n5', source: 'N2', target: 'N5', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n3-n4', source: 'N3', target: 'N4', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n3-n5', source: 'N3', target: 'N5', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n4-n5', source: 'N4', target: 'N5', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n4-n6', source: 'N4', target: 'N6', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n5-n6', source: 'N5', target: 'N6', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n5-n7', source: 'N5', target: 'N7', style: { stroke: '#10b981', ...commonEdgeStyle } },
    { id: 'e-n6-n7', source: 'N6', target: 'N7', style: { stroke: '#10b981', ...commonEdgeStyle } },

    // --- Flex Algo 129 (Blue - PA-EVPN) ---
    // Representing specific redundant links
    { id: 'e-ce-n1-blue', source: 'CE', target: 'N1', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.6 } },
    { id: 'e-ce-n2-blue', source: 'CE', target: 'N2', type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.6 } },

    // --- Flex Algo 130 (Orange - AA-EVPN) ---
    { id: 'e-ce-n1-orange', source: 'CE', target: 'N1', type: 'smoothstep', style: { stroke: '#f97316', strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.6 } },
    { id: 'e-ce-n2-orange', source: 'CE', target: 'N2', type: 'smoothstep', style: { stroke: '#f97316', strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.6 } },

    // --- Endpoint Connections ---
    { id: 'e-teq1-n2', source: 'Teq1', target: 'N2', style: { stroke: '#94a3b8', strokeWidth: 1 } },
    { id: 'e-teq4-n4', source: 'Teq4', target: 'N4', style: { stroke: '#94a3b8', strokeWidth: 1 } },
    { id: 'e-teq5-n5', source: 'Teq5', target: 'N5', style: { stroke: '#94a3b8', strokeWidth: 1 } },
    { id: 'e-teq6-n6', source: 'Teq6', target: 'N6', style: { stroke: '#94a3b8', strokeWidth: 1 } },
];

// Logs
export const nodeLogs: Record<string, string> = {
    'N1': `[INFO] Traffic Flow Detected: Teq9 -> CE -> N1 -> N5
[INFO] Flex Algo 128: Metric 10
[INFO] Flex Algo 129: Metric 20 (Backup)
[CONFIG] set protocols isis protocol-instance 0 segment-routing flex-algo 128`,
    'N5': `[INFO] Traffic Destination Reached
[INFO] Ingress: N1 (Flex Algo 128)
[INFO] Egress: Teq5`,
    'CE': `[INFO] EVPN Instance 100 Up
[INFO] Active Path: N1 (AA-EVPN)
[INFO] Standby Path: N2 (PA-EVPN)`,
};
