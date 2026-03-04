import React from "react";

interface AuthPropType {
    title:string;
    subtitle:string;
    children:React.ReactNode
}
export function AuthCard({title,subtitle,children}:AuthPropType){
    return(
          <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-2">{subtitle}</p>
          {children}
        </div>
    );
}