'use server';

import { userCollection } from "@/db/collections";
import { validateAuthorization } from "@/app/api/authorization/role-validation";
import { UserRoles } from "@/data/constants";

interface ListUsersParams {
  role?: UserRoles;
  roles?: UserRoles[];
  page?: number;
  limit?: number;
  search?: string;
}

export async function listUsersAdmin({ role, roles, page = 1, limit = 12, search }: ListUsersParams) {
  const allowed = await validateAuthorization([UserRoles.ADMIN]);
  if (!allowed) {
    return { success: false, message: 'Not authorized', data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: limit } };
  }

  const query: any = {};
  if (roles && roles.length > 0) {
    query.role = { $in: roles };
  } else if (role) {
    query.role = role;
  }
  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const totalItems = await userCollection.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const users = await userCollection
    .find(query)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const serialized = users.map((u: any) => ({
    _id: u._id?.toString() || null,
    user_id: u.user_id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at instanceof Date ? u.created_at.toISOString() : u.created_at,
    last_sign_in: u.last_sign_in instanceof Date ? u.last_sign_in.toISOString() : u.last_sign_in,
  }));

  return {
    success: true,
    data: serialized,
    pagination: { currentPage: page, totalPages, totalItems, itemsPerPage: limit },
  };
}


