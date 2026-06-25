import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { addUserSchema, type AddUserInput } from '@/utils/form';
import { useAdminStore } from '@/utils/store';
import { UserPlus } from 'lucide-react';
import api from '@/utils/api';

export default function CreateUserModal() {
    const { t } = useTranslation('admin');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { fetchUsers } = useAdminStore();

    const form = useForm<AddUserInput>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'MEMBER',
        },
    });

    async function onSubmit(data: AddUserInput) {
        setLoading(true);
        try {
            await api.post('/auth/register', data);
            toast.success(t('create.success'));
            fetchUsers();
            setOpen(false);
            form.reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('create.error'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)] gap-2 group">
                    <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" /> {t('create.button')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden glass-card border-white/10 shadow-3xl">
                <div className="bg-gradient-to-br from-[#5606ff] to-[#fe8989] p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                        <UserPlus className="h-24 w-24" />
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-xl mb-4 border border-white/30">
                        I
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{t('create.title')}</h2>
                </div>

                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 font-bold uppercase text-[10px] tracking-widest pl-1">{t('create.labels.name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('create.placeholders.name')} {...field} className="h-11 glass border-white/10 text-white focus:ring-[#5606ff]/30 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 font-bold uppercase text-[10px] tracking-widest pl-1">{t('create.labels.email')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('create.placeholders.email')} {...field} className="h-11 glass border-white/10 text-white focus:ring-[#5606ff]/30 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/40 font-bold uppercase text-[10px] tracking-widest pl-1">{t('create.labels.role')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 glass border-white/10 text-white focus:ring-[#5606ff]/30 rounded-xl">
                                                    <SelectValue placeholder={t('create.placeholders.role')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glass-dark border-white/10 text-white">
                                                <SelectItem value="MEMBER">{t('management.roles.member')}</SelectItem>
                                                <SelectItem value="ADMIN">{t('management.roles.admin')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-bold uppercase text-[10px] tracking-widest pl-1">{t('create.labels.password')}</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} className="h-11 glass border-white/10 text-white focus:ring-[#5606ff]/30 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/40 font-bold uppercase text-[10px] tracking-widest pl-1">{t('create.labels.confirmPassword')}</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} className="h-11 glass border-white/10 text-white focus:ring-[#5606ff]/30 rounded-xl" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-all font-bold rounded-xl shadow-lg mt-4" disabled={loading}>
                                {loading ? '...' : t('create.submit')}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
