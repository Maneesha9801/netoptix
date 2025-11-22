import { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Node,
    useNodesState,
    useEdgesState,
    NodeMouseHandler,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Activity, Router, Network } from 'lucide-react';
import { initialNodes, initialEdges, nodeLogs } from './data';

export default function App() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
        setSelectedNode(node);
    }, []);

    return (
        <div className="w-screen h-screen bg-background text-white overflow-hidden flex font-mono">
            {/* Main Graph Area */}
            <div className="flex-1 h-full relative">
                <div className="absolute top-6 left-6 z-10 bg-surface/90 backdrop-blur p-6 rounded-xl border border-gray-700 shadow-2xl">
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white tracking-tight">
                        <Activity className="text-primary animate-pulse" size={32} />
                        NetOptix
                    </h1>
                    <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                        Live Topology Visualization
                    </p>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                    className="bg-background"
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: { strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#666' },
                    }}
                >
                    <Background color="#333" gap={25} size={1} />
                    <Controls className="bg-surface border-gray-700 fill-white" />
                </ReactFlow>
            </div>

            {/* Contextual Sidebar */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-[450px] bg-surface/95 backdrop-blur border-l border-gray-700 shadow-2xl z-20 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-700 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                    {selectedNode.data.type === 'router' ? <Router size={24} className="text-info" /> : <Network size={24} className="text-gray-400" />}
                                    {selectedNode.data.label}
                                </h2>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase ${selectedNode.data.status === 'critical' ? 'bg-danger/20 text-danger border border-danger/50' :
                                        selectedNode.data.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' :
                                            'bg-primary/20 text-primary border border-primary/50'
                                        }`}>
                                        {selectedNode.data.status}
                                    </span>
                                    <span className="text-xs text-gray-500">ID: {selectedNode.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Logs */}
                        <div className="flex-1 p-0 overflow-hidden flex flex-col">
                            <div className="px-8 py-4 bg-black/40 border-b border-gray-800 flex items-center gap-2 text-gray-400 text-sm uppercase tracking-wider font-bold">
                                <Terminal size={14} />
                                <span>Live Log Stream</span>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto font-mono text-xs leading-relaxed bg-black/20">
                                <div className="text-gray-300 whitespace-pre-wrap">
                                    {nodeLogs[selectedNode.id] ? (
                                        nodeLogs[selectedNode.id].split('\n').map((line, i) => (
                                            <div key={i} className={`mb-1 ${line.includes('[CRITICAL]') || line.includes('[ERROR]') ? 'text-danger font-bold' :
                                                line.includes('[WARN]') ? 'text-yellow-500' :
                                                    line.includes('[CONFIG]') ? 'text-info' :
                                                        'text-gray-400'
                                                }`}>
                                                <span className="opacity-50 mr-3">{new Date().toLocaleTimeString()}</span>
                                                {line}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 italic">[INFO] No active logs or anomalies detected for this node.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
