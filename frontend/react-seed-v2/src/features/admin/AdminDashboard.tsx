import * as React from 'react';
import {
    Users,
    ClipboardList,
    UserCheck,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Mail,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAdminStore, useAuthStore } from '@/utils/store';
import AdminApprovalPanel from './AdminApprovalPanel';
import CreateUserModal from './CreateUserModal';
import UserTasksPanel from './UserTasksPanel';

const AdminDashboard: React.FC = () => {
    const { t } = useTranslation('admin');
    const { users, fetchUsers, stats: globalStats, deleteUser } = useAdminStore();
    const currentUser = useAuthStore((state) => state.user);
    const [expandedUserId, setExpandedUserId] = React.useState<number | null>(null);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId: number, email: string) => {
        if (window.confirm(t('management.deleteConfirm', { email }))) {
            try {
                await deleteUser(userId);
                toast.success(t('management.deleteSuccess'));
            } catch (error: any) {
                toast.error(error.message || t('management.deleteError'));
            }
        }
    };

    const canDeleteUser = (userToDelete: any) => {
        if (userToDelete.role === 'SUPER_ADMIN') return false;
        // Super admin can delete anyone else
        if (currentUser?.role === 'SUPER_ADMIN') return true;
        // Admin can only delete members
        if (currentUser?.role === 'ADMIN' && userToDelete.role === 'MEMBER') return true;
        return false;
    };

    const stats = [
        {
            label: t('stats.totalUsers'),
            value: globalStats.totalUsers,
            icon: <Users className="h-4 w-4 text-white/70" />,
        },
        {
            label: t('stats.totalTasks'),
            value: globalStats.totalTasks,
            icon: <ClipboardList className="h-4 w-4 text-white/70" />,
        },
        {
            label: t('stats.activeMembers'),
            value: globalStats.activeMembers,
            icon: <UserCheck className="h-4 w-4 text-white/70" />,
        },
    ];

    const toggleExpand = (userId: number) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    return (
        <div className="container py-10 space-y-10 animate-in fade-in duration-700 relative">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5606ff]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fe8989]/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-4 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="p-5 bg-gradient-to-br from-[#5606ff] to-[#fe8989] rounded-2xl shadow-xl ring-1 ring-white/20 transform hover:rotate-6 transition-transform">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{t('title')}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                <div className="h-1 w-10 bg-gradient-to-r from-[#5606ff] to-[#fe8989] rounded-full" />
                                <p className="text-white/40 font-bold italic uppercase tracking-widest text-[10px] sm:text-xs">{t('subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    <CreateUserModal />
                </div>

                {/* Stats Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="glass-card shadow-xl border-white/5 group hover:scale-[1.02] transition-all duration-500 cursor-default relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 h-24 w-24 bg-[#5606ff]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <CardHeader className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 pb-3 relative z-10">
                                <CardTitle className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase group-hover:text-white/70 transition-colors">{stat.label}</CardTitle>
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#5606ff]/20 group-hover:rotate-12 transition-all duration-500 ring-1 ring-white/10">
                                    {stat.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center sm:items-start relative z-10">
                                <div className="text-5xl font-black text-white tracking-tighter">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Super Admin Approval Panel */}
                {isSuperAdmin && <AdminApprovalPanel />}

                {/* User Management Panel */}
                <Card className="glass-card shadow-2xl border-white/5 overflow-hidden relative group">
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -right-24 h-48 w-48 bg-[#5606ff]/10 blur-[100px] rounded-full group-hover:bg-[#5606ff]/20 transition-all duration-700" />

                    <CardHeader className="bg-white/5 border-b border-white/5 p-8 relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#5606ff]/30 transition-all duration-500 shadow-xl">
                                <Users className="h-8 w-8 text-[#5606ff]" />
                            </div>
                            <div className="text-center sm:text-left">
                                <CardTitle className="text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                    {t('management.title')}
                                </CardTitle>
                                <CardDescription className="text-white/40 font-medium mt-2 leading-relaxed max-w-lg">
                                    {t('management.description')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div>
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="w-[40px]"></TableHead>
                                        <TableHead className="text-white/70 font-bold py-5">{t('management.table.user')}</TableHead>
                                        <TableHead className="text-white/70 font-bold">{t('management.table.role')}</TableHead>
                                        <TableHead className="text-white/70 font-bold">{t('management.table.status')}</TableHead>
                                        <TableHead className="text-center text-white/70 font-bold">{t('management.table.tasks')}</TableHead>
                                        <TableHead className="text-right text-white/70 font-bold pr-6">{t('management.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow className="border-white/5">
                                            <TableCell colSpan={6} className="h-32 text-center text-white/40">
                                                {t('management.table.noUsers')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <React.Fragment key={user.id}>
                                                <TableRow
                                                    className="border-white/5 hover:bg-white/5 transition-all duration-300 group"
                                                >
                                                    <TableCell
                                                        className="cursor-pointer pl-6"
                                                        onClick={() => toggleExpand(user.id)}
                                                    >
                                                        {expandedUserId === user.id ? (
                                                            <ChevronUp className="h-5 w-5 text-[#fe8989]" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-white/30 group-hover:text-white transition-colors" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        className="cursor-pointer"
                                                        onClick={() => toggleExpand(user.id)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover:text-[#5606ff] transition-colors">{user.name}</span>
                                                            <span className="text-xs text-white/40 font-medium flex items-center gap-1 mt-0.5">
                                                                <Mail className="h-3 w-3" /> {user.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'bg-[#5606ff]/20 text-[#5606ff] ring-[#5606ff]/30' : 'bg-white/5 text-white/60 ring-white/10'} border-none px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ring-1 backdrop-blur-md transition-all group-hover:ring-white/20`}>
                                                            {t(`management.roles.${user.role.toLowerCase()}`)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`border-none px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ring-1 backdrop-blur-md ${user.status === 'APPROVED'
                                                                ? "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20"
                                                                : user.status === 'PENDING'
                                                                    ? "text-amber-400 bg-amber-400/10 ring-amber-400/20"
                                                                    : "text-rose-400 bg-rose-400/10 ring-rose-400/20"
                                                                } group-hover:ring-white/20 transition-all`}
                                                        >
                                                            {t(`management.status.${(user.status || 'ACTIVE').toLowerCase()}`)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center font-black text-xl text-white">
                                                        {user.taskCount || 0}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="gap-2 glass hover:bg-white/10 text-white border-white/5 hover:border-[#5606ff]/50 transition-all duration-300 font-bold group/btn"
                                                                onClick={() => toggleExpand(user.id)}
                                                            >
                                                                <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" /> {t('management.details')}
                                                            </Button>
                                                            {canDeleteUser(user) && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 glass text-rose-400/80 hover:bg-rose-400/20 hover:text-rose-400 border-white/5"
                                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedUserId === user.id && (
                                                    <TableRow className="border-none bg-white/5">
                                                        <TableCell colSpan={6} className="p-0 border-none">
                                                            <div className="px-12 py-8 border-l-4 border-[#fe8989] bg-gradient-to-r from-[#fe8989]/5 to-transparent">
                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="p-2 bg-[#fe8989]/20 rounded-lg">
                                                                        <ClipboardList className="h-5 w-5 text-[#fe8989]" />
                                                                    </div>
                                                                    <h3 className="text-xl font-bold text-white">{t('management.userTasks', { name: user.name })}</h3>
                                                                </div>
                                                                <UserTasksPanel userId={user.id} />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
