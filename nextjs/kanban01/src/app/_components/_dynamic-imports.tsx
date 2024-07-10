import dynamic from 'next/dynamic';


const ReactKanban = dynamic(() => import('@lourenci/react-kanban'), { ssr: false })

const allImports = { ReactKanban }
export default allImports


