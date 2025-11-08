'use client';
import { useEffect,  useRef, useState } from 'react';
import { AdminSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listUsersAdmin } from '@/app/api/admin/users/list-users';
import { UserRoles } from '@/data/constants';

export default function AdminAgentsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 12 });
  const [search, setSearch] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = async (pageNum: number, searchText?: string) => {
    setIsLoading(true);
    const res = await listUsersAdmin({ roles: [UserRoles.AGENCY_MANAGER, UserRoles.AGENCY_STAFF], page: pageNum, limit: 12, search: searchText });
    if (res.success) {
      setUsers(res.data);
      setPagination(res.pagination);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, value);
    }, 500);
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <span className="text-lg font-semibold">Agents</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Agencies</CardTitle>
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64"
              />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Sign In</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!isLoading && users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users found</TableCell>
                      </TableRow>
                    )}
                    {users.map((u) => (
                      <TableRow key={u._id || u.user_id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.role === UserRoles.AGENCY_MANAGER ? 'Manager' : 'Staff'}</TableCell>
                        <TableCell>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Simple Pagination */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
                </span>
                <button
                  disabled={pagination.totalPages === 0 || page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


