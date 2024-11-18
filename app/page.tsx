export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white 
      w-full max-w-screen-sm 
      shadow-lg p-5 rounded-3xl flex flex-col
      gap-3
      ">
        <div className="group flex flex-col">
          <input className="bg-gray-100 w-full" placeholder="write your email" />
          <span className="group-focus-within:block hidden">Make sure it is a valiud email</span>
          <button>Submit</button>
        </div>
        <div />
      </div>
    </ main>
  )
}