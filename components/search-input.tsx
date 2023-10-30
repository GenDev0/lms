"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "@/components/ui/input";

interface SearchInputProps {}

const SearchInput = (props: SearchInputProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className='relative'>
      <Search className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
      <Input
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search for a course'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
export default SearchInput;
