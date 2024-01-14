"use client";

import { auth } from "@/libs/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseError } from "firebase/app";

