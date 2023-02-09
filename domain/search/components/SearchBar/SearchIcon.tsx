export default function SearchIcon() {
  return (
    <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
      <button type="button" className="rounded-full">
        <span className="sr-only">Submit</span>
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            fillRule="evenodd"></path>
        </svg>
      </button>
    </span>
  );
}
