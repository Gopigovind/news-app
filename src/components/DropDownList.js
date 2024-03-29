import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropDownList = ({ dataSource, value, onChange, clickHandler, isHide=false }) => {
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (dataSource?.length > 0) {
      const defaultItem = dataSource.filter(item => (item?.attributes?.name || item.code) === value)[0];
      setSelected(defaultItem);
    }
  }, [dataSource, value]);

  const changeHandler = (item) => {
    setSelected(item);
    onChange && onChange(item);
  };
  const ddlClickHandler = (event) => {
    clickHandler && clickHandler(event);
  }

  return (
    <Listbox value={selected} onChange={changeHandler}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button onClick={ddlClickHandler} className="relative w-full cursor-pointer bg-white dark:bg-zinc-900 dark:text-white py-1.5 pl-3 pr-10 text-left text-gray-700 focus:outline-none sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected?.attributes?.name || selected?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open && !isHide}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 min-w-fit max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 dark:text-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {dataSource?.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-800 dark:bg-zinc-800 dark:text-white',
                        'relative cursor-default select-none py-2 pl-3 pr-9 '
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center flex-col pr-6">
                          {/* <img src={item.avatar || ''} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {item.attributes?.name || item.name}
                          </span>
                          {
                            item?.attributes?.localName && (
                              <span
                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                              >
                                {item.attributes.localName}
                              </span>
                            )
                          }
                        </div>
                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-gray-900' : 'text-gray-800',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default DropDownList;
