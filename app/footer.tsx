import { A } from "./components/a";

export function Footer() {
  return (
    <footer className="p-6 pt-3 pb-6 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow text-left">
        Doge Sound Club (
        <A target="_blank" href="https://twitter.com/rauchg">
          @dogesoundclub
        </A>
        )
      </div>
      <div>
        <A target="_blank" href="https://github.com/dogesoundclub">
          Source
        </A>
      </div>
    </footer>
  );
}
