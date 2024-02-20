import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from "react-redux";
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { BASE_URL } from "./../utils/constants";
import { updateDistrict, updateLocale, updateState, updateModal, updateTaluk } from "../utils/appSlice";


export default function Modal() {
    const [localeData, setLocaleData] = useState([]);
    const localeName = useSelector((store) => store.app.locale);
    const stateName = useSelector((store) => store.app.stateName);
    const districtName = useSelector((store) => store.app.districtName);
    const talukName = useSelector((store) => store.app.talukName);
    const isShow = useSelector((store) => store.app.showModal);
    const dispatch = useDispatch();
    const cancelButtonRef = useRef(null);
    const [open, setOpen] = useState(!(localeName && stateName));

    const [locale, setLocale] = useState(localeName);
    const [state, setState] = useState(stateName);
    const [districtData, setDistrictData] = useState([]);
    const [district, setDistrict] = useState(districtName);
    const [taluk, setTaluk] = useState(talukName);
    const [talukData, setTalukData] = useState([]);

    const localeApiHandler = async () => {
        const response = await fetch(`${BASE_URL}/i18n/locales`);
        const data = await response.json();
        setLocaleData(data);
    }

    useEffect(() => {
        isShow && setOpen(isShow);
    }, [isShow]);

    useEffect(() => {
        localeApiHandler();
    }, []);

    const changeLocale = (item) => {
        setLocale(item.code);
        setState('');
        localStorage.removeItem('state');
    }

    const [stateData, setStateData] = useState([]);

    const stateApiHandler = async () => {
        const response = await fetch(`${BASE_URL}/states?locale=${locale}`);
        const { data } = await response.json();
        setStateData(data);
    }

    useEffect(() => {
        stateApiHandler();
    }, [locale]);

    const changeState = (item) => {
        setState(item?.attributes?.name);
        setDistrict('');
        localStorage.removeItem('district');
    }
    const changeDistrict = (item) => {
        setDistrict(item?.attributes?.name);
        setTaluk('');
        localStorage.removeItem('taluk');
    }
    const districtHandler = async () => {
        const response = await fetch(`${BASE_URL}/districts?locale=${locale}&fields[0]=name&populate[state][fields][0]=name&filters[state][name][$in][0]=${state}`);
        const { data } = await response.json();
        setDistrictData(data);
    }

    useEffect(() => {
        districtHandler();
    }, [state]);

    const clickHandler = () => {
        if (state && locale) {
            localStorage.setItem('locale', locale);
            dispatch(updateLocale(locale));
            localStorage.setItem('state', state);
            dispatch(updateState(state));
            localStorage.setItem('district', district);
            dispatch(updateDistrict(district));
            localStorage.setItem('taluk', taluk);
            dispatch(updateTaluk(taluk));
            setOpen(false);
        }
    }
    useEffect(() => {
        dispatch(updateModal(open));
    }, [open]);

    const talukHandler = async () => {
        const response = await fetch(`${BASE_URL}/taluks?locale=${locale}&fields[0]=name&populate[state][fields][0]=name&populate[district][fields][0]=name&filters[district][name][$in][0]=${district}`);
        const { data } = await response.json();
        setTalukData(data);
    };

    useEffect(() => {
        talukHandler();
    }, [district]);

    const changeTaluk = (item) => {
        setTaluk(item?.attributes?.name);
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="dark:bg-zinc-800 dark:text-white relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:items-start">
                                        <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="dark:bg-zinc-800 dark:text-white text-base font-semibold leading-6 text-gray-900">
                                                <span>Language or region of interest</span>
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                {localeData?.length > 0 && <ModalDDL placeholder='Select the language' dataSource={localeData} value={locale} onChange={changeLocale} />}
                                            </div>
                                        </div>
                                        {
                                            (locale && stateData?.length > 0) && (
                                                <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="dark:bg-zinc-800 dark:text-white text-base font-semibold leading-6 text-gray-900">
                                                        <span>Select the state</span>
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <ModalDDL placeholder='Select the state' dataSource={stateData} value={state} onChange={changeState} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (state && districtData?.length > 0) && (
                                                <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="dark:bg-zinc-800 dark:text-white text-base font-semibold leading-6 text-gray-900">
                                                        <span>Select the district(optional)</span>
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <ModalDDL placeholder='Select the district' dataSource={districtData} value={district} onChange={changeDistrict} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (district && talukData?.length > 0) && (
                                                <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="dark:bg-zinc-800 dark:text-white text-base font-semibold leading-6 text-gray-900">
                                                        <span>Select the Taluk(optional)</span>
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <ModalDDL placeholder='Select the taluk' dataSource={talukData} value={taluk} onChange={changeTaluk} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="dark:bg-zinc-800 dark:text-white px-4 py-3 justify-center sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className={`${!(state && locale) ? 'opacity-50 cursor-not-allowed' : ''} dark:bg-gray-500 dark:text-white inline-flex w-full justify-center rounded-md bg-gray-200 hover:bg-gray-400 px-3 py-2 text-sm font-semibold text-gray-950 shadow-sm sm:ml-3 sm:w-auto`}
                                        onClick={clickHandler}
                                    >
                                        Update
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function ModalDDL({ dataSource, value, onChange, placeholder }) {
    const [selected, setSelected] = useState();

    useEffect(() => {
        if (dataSource?.length > 0) {
            const defaultItem = dataSource.filter(item => (item?.attributes?.name || item.code) === value)[0];
            setSelected(defaultItem);
        }
    }, [dataSource]);

    const changeHandler = (item) => {
        setSelected(item);
        onChange && onChange(item);
    }

    return (
        <Listbox value={selected} onChange={changeHandler}>
            {({ open }) => (
                <>
                    <div className="relative mt-2">
                        <Listbox.Button className="dark:bg-zinc-800 dark:text-white relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                                <span className="ml-3 block truncate">{selected?.attributes?.name || selected?.name || placeholder}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="dark:bg-zinc-800 dark:text-white dark:border absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                                <div className="flex flex-col pr-6">
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
