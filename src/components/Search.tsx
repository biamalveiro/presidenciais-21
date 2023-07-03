import type { Parish } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import WindowedSelect, { createFilter } from "react-windowed-select";
import { api } from "~/utils/api";

export const selectedParishAtom = atom<Parish | null>(null);

export default function Search() {
  const [selectParish, setSelectParish] = useAtom(selectedParishAtom);
  const { data, isLoading } = api.results.getAllParishes.useQuery();
  const { t } = useTranslation("common");

  const options = useMemo(() => {
    if (!data) return [];
    return data.map((parish) => ({
      label: `${parish.name}, ${parish.county}, ${parish.region}`,
      value: parish.dicofre,
    }));
  }, [data]);

  if (isLoading || !data) {
    return null;
  }

  const handleSelectChange = (selectedOption: {
    label: string;
    value: Parish["dicofre"];
  }) => {
    if (selectedOption?.value) {
      const parish = data.find(
        (parish) => parish.dicofre === selectedOption.value
      );
      if (parish) {
        setSelectParish(parish as Parish);
      }
    } else {
      setSelectParish(null);
    }
  };

  return (
    <div>
      <WindowedSelect
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onChange={handleSelectChange}
        className="w-full"
        isClearable
        isSearchable
        value={options.find((option) => option.value === selectParish?.dicofre)}
        name="parish"
        options={options}
        placeholder={t("search-placeholder")}
        filterOption={createFilter({ ignoreAccents: false })}
      />
    </div>
  );
}
