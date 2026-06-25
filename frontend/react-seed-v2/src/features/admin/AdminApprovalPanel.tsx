import * as React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '@/utils/store';

const AdminApprovalPanel: React.FC = () => {
    const { t } = useTranslation('admin');
    const { pendingAdmins, fetchPendingAdmins, updateUserStatus, loading } = useAdminStore();

    React.useEffect(() => {
        fetchPendingAdmins();
    }, [fetchPendingAdmins]);

    const handleAction = async (userId: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            await updateUserStatus(userId, status);
            toast.success(t('approval.success', { status: status.toLowerCase() }));
        } catch (error) {
            toast.error(t('approval.error'));
        }
    };

    if (pendingAdmins.length === 0) return null;

    return (
        <Card className="mb-8 border-[#fe8989]/20 glass shadow-xl overflow-hidden relative group/approval">
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#fe8989]/5 blur-3xl rounded-full" />

            <CardHeader className="bg-[#fe8989]/5 border-b border-[#fe8989]/10 p-8 relative">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 bg-[#fe8989]/10 rounded-2xl border border-[#fe8989]/20 shadow-lg">
                        <ShieldAlert className="h-8 w-8 text-[#fe8989]" />
                    </div>
                    <div className="text-center sm:text-left">
                        <CardTitle className="text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            {t('approval.title')}
                        </CardTitle>
                        <CardDescription className="text-[#fe8989]/50 font-medium mt-2 max-w-md">
                            {t('approval.description')}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingAdmins.map((admin) => (
                        <Card key={admin.id} className="glass-card border-white/10 hover:border-[#fe8989]/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 h-24 w-24 bg-[#fe8989]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <CardContent className="p-6 flex flex-col gap-6 relative z-10">
                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                                    <span className="font-black text-white text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">{admin.name}</span>
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{admin.email}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <Badge className="bg-amber-400/10 text-amber-400 border-none px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ring-1 ring-amber-400/20">{t('approval.pending')}</Badge>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-10 w-10 glass text-rose-400/80 hover:bg-rose-400/20 hover:text-rose-400 border-white/5 rounded-xl transition-all"
                                            onClick={() => handleAction(admin.id, 'REJECTED')}
                                            title={t('approval.reject')}
                                            disabled={loading}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:opacity-90 hover:scale-110 active:scale-95 transition-all"
                                            onClick={() => handleAction(admin.id, 'APPROVED')}
                                            title={t('approval.approve')}
                                            disabled={loading}
                                        >
                                            <Check className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminApprovalPanel;
