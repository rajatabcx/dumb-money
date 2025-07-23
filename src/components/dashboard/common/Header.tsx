import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="md:m-0 z-50 px-6 md:border-b h-[70px] flex justify-between items-center desktop:sticky desktop:top-0 desktop:bg-background sticky md:static top-0 backdrop-filter backdrop-blur-xl md:backdrop-filter md:backdrop-blur-none bg-opacity-70 desktop:rounded-t-[10px]">
      <MobileMenu />

      {/* <OpenSearchButton /> */}

      <div className="flex space-x-2 ml-auto">
        {/* <Trial /> */}
        {/* <ConnectionStatus /> */}
        {/* <NotificationCenter /> */}
        <UserMenu />
      </div>
    </header>
  );
}
