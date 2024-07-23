'use client';

import LogoMdc from "@/public/logo1.svg";
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import  useAuth  from "@/hooks/useAuth";
import { signOut } from "firebase/auth"
import { auth } from "@/db/firebaseConfig"


export default function Nav() {

  const {user} = useAuth()
  const router = useRouter()
  
  const handleSignOut = ()=> {
    signOut(auth)
    router.push('/')
  }

  return (
    <nav className="max-w-[1200px] w-full mx-auto h-[80px] flex items-center justify-between p-5 border-b  border-gray-300">

      <div>
        <Link href='/'>
        <Image width={30} height={30} src={LogoMdc} className=" w-12 h-12" alt="Logo La Minute De Code" />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!user ?(
        <Link href="/signInAndUp">
        <Button className="bg-blue-950">
          <User className="w-4" />
        </Button>
        </Link> ) : (
          <>
          <Link href="/dashboard">
        <Button>
          <User className="w-4" />
        </Button>
        </Link> 
        <Button onClick={handleSignOut}>
            <LogOut className="w-4" />
          </Button>
          </>
        )}
      </div>

  </nav>
  )
}
