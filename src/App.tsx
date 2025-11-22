import { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Node,
    useNodesState,
    useEdgesState,
    NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Activity, Server, ShieldAlert } from 'lucide-react';
import { initialNodes, initialEdges, nodeLogs } from './data';

export default function App() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
        setSelectedNode(node);
    }, []);

    return (
        <div className="w-screen h-screen bg-background text-white overflow-hidden flex">
            {/* Main Graph Area */}
            <div className="flex-1 h-full relative">
                <div className="absolute top-4 left-4 z-10 bg-surface p-4 rounded-lg border border-gray-700 shadow-xl">
                    <h1 className="text-2xl font-mono font-bold flex items-center gap-2">
                        <Activity className="text-primary" /> NetOptix
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Live Topology Visualization</p>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                    className="bg-background"
                >
                    <Background color="#333" gap={20} />
                    <Controls className="bg-surface border-gray-700 fill-white" />
                </ReactFlow>
            </div>

            {/* Contextual Sidebar */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="absolute right-0 top-0 bottom-0 w-96 bg-surface border-l border-gray-700 shadow-2xl z-20 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {selectedNode.data.label.includes('Router') ? <Server size={20} /> : <ShieldAlert size={20} />}
                                    {selectedNode.data.label}
                                </h2>
                                <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${selectedNode.data.status === 'critical' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'
                                    }`}>
                                    {selectedNode.data.status.toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Logs */}
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
                            <div className="flex items-center gap-2 text-gray-400 mb-4">
                                <Terminal size={16} />
                                <span>System Logs</span>
                            </div>
                            <div className="bg-black p-4 rounded-lg border border-gray-800 text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {nodeLogs[selectedNode.id] || "[INFO] No anomalies detected in log stream."}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
