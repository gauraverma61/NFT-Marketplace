import React from "react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className=" flex items-center justify-between px-6 py-4 bg-dark-1 text-white ">
      <div className="flex items-center">
        <div className=" text-2xl font-bold mx-4 border-r px-4">NFTS Pro</div>
        <div className=" flex items-center gap-x-4 font-semibold">
          <div>Explore</div>
          <div>Create</div>
        </div>
      </div>
      <div className=" border border-gray-600 bg-dark-2 flex items-center gap-3 py-3 px-4 rounded-lg w-full max-w-[480px] hover:brightness-125 active:outline-2">
        {/* <Search /> */}
        <input
          className=" bg-transparent border-none outline-none flex-1"
          type="text"
        />
      </div>
      <div>
        <Button>Connect</Button>
      </div>
    </div>
  );
};

export default Header;
