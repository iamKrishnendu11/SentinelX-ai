"use client";

import Link from "next/link";

interface TransitionLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
