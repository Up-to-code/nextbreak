import DashboardLayout from "./components/layout";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}

export default AdminLayout;