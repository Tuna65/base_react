import { Avatar } from "@/components";
import type { ManagedUser } from "@/apis/user";
export default function UserProfile({ user }: { user: ManagedUser }) {
  const name = user.displayName || user.username;
  return (
    <div className="flex items-center gap-3">
      <Avatar src={user.avatarUrl || undefined} size={40} className="!shrink-0 !bg-[#c4bfff] !text-[#252036]">
        {name.slice(0, 2).toUpperCase()}
      </Avatar>
      <div className="min-w-0">
        <span className="block truncate font-semibold">{name}</span>
        <span className="mt-0.5 block truncate !text-xs text-[#797586] dark:text-[#93909f]">{user.username}</span>
      </div>
    </div>
  );
}
