import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import '../../assets/css/home/home.css';
import '../../assets/css/home/modal.css';
import { TH_STT, TH_PHONE, TH_MONEY, TH_INFO, TH_TRACK, TR_TYPE_NUMBER, TR_TYPE_MONEY, TR_TYPE_ADD, sampleData } from "../../constants/home/home.constant";
import { ADD_PHONE, GET_LIST_PHONE, SEARCH_PHONE, SET_INTERVAL_PHONE, SET_WAIT_TIME } from "../../action/home/home.action";
import { readFileExcel, createFileExcel } from "../../service/excel/excel.client.service";
import { useSelector, useDispatch } from 'react-redux';

import Row from './row.home.screen';
import { validatePhonenumber } from "../../service/util/utils.client";

export default function Home() {
    const [phone, setPhone] = useState("");
    const [money, setMoney] = useState(0);
    const [warningPhone, setWarningPhone] = useState("");

    //#region modal
    const customStyles = {
        content: {
            top: '30%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    const url_1 = 'http://gqknccos.vnpt.vn/Views/TTKH/ThongTinKhachHang.aspx';
    const url_2 = 'http://crosssellccos.vnpt.vn/Views/KhachHang/ThongTinKhachHang.aspx';
    const [modalIsOpen, setIsOpen] = React.useState(true);
    const [selectedURL, setSelectedURL] = React.useState(1);
    const [time, setTime] = React.useState(8);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
        // khoi tao interval - duy nhat 1 lan
        dispatch({ type: SET_INTERVAL_PHONE, data: { waitTime: time, urlID: selectedURL } });
    }

    function selectURL(event) {
        console.log(event.target.value);
        setSelectedURL(event.target.value);
    }

    function changeTime(event) {
        if (event.target.value > 8) {
            setTime(event.target.value);
            //dispatch({ type: SET_WAIT_TIME, waitTime: event.target.value * 1000 });
        } else {
            setTime(8);
            //dispatch({ type: SET_WAIT_TIME, waitTime: 8 * 1000 });
        }
    }


    //#endregion

    const dispatch = useDispatch();

    let listPhone = useSelector(state => state.home.listPhone);
    let warning = useSelector(state => state.home.warning);
    let notiPhone = useSelector(state => state.home.notiPhone);

    //v???a v??o home s??? get data
    useEffect(() => {
        console.log("current list phone", listPhone);
        if (listPhone.length === 0) {
            dispatch({ type: GET_LIST_PHONE, data: null });
        }
    }, []);

    useEffect(() => {
        console.log("current list phone", listPhone);
    }, [listPhone]);

    useEffect(() => {
        console.log("current noti phone", notiPhone);
    }, [notiPhone]);

    let readFile = (e) => {
        readFileExcel(e.target.files[0], (data) => {
            //data l?? m???ng ch???a danh s??ch thu?? bao v?? s??? ti???n
            data.forEach((item, index) => {
                //B??? qua d??ng ?????u v?? l?? ti??u ?????

                if (index > 0) {
                    console.log("data in file excel", item);
                    // useDispatch({ type: ADD_PHONE, value: item });
                    dispatch({ type: ADD_PHONE, data: { phone: item[0], money: item[1], urlID: selectedURL } });
                }
            });
        });

        //ph???i c???n d??ng d?????i, v?? n???u nh?? l???n th??? hai ch???n c??ng 1 file, s??? kh??ng ???????c t??nh l?? opnchange, h??m onchange s??? kh??ng g???i l???i
        e.target.value = null;
    }

    let downloadFile = (e) => {
        createFileExcel(sampleData);
    }

    let onInputPhone = (e) => {
        setPhone(e.target.value);
        if (!validatePhonenumber(phone))
            setWarningPhone("S??? ??i???n tho???i kh??ng h???p l???");
        else
            setWarningPhone("");
    }

    let onInputMoney = (e) => {
        setMoney(e.target.value);
    }

    let onInputSearch = (e) => {
        if (e.target.value == "") {
            dispatch({
                type: SEARCH_PHONE,
                data: -1
            }
            )
        } else {
            if (listPhone) {
                listPhone.forEach((element, index) => {
                    //console.log("element is", element);
                    if (element.phone.includes(e.target.value)) {
                        //console.log("found", index);
                        dispatch({
                            type: SEARCH_PHONE,
                            data: index,
                        })
                        //inputSearch.current.focus();
                    }
                });
            }
        }
    }

    let addNew = () => {
        dispatch({ type: ADD_PHONE, data: { phone: phone, money: money, urlID: selectedURL } });
    }

    return (
        <div className="crawl-login" id="div_craw">
            <div className="input-add-div">
                <input className="input-add"
                    type="text" placeholder="Nh???p s??? c???n t??m" onChange={onInputSearch} />
            </div>
            <div className="crawl-login-crawl">
                <table>
                    <tbody>
                        <tr>
                            <th>{TH_STT}</th>
                            <th>{TH_PHONE}</th>
                            <th>{TH_MONEY}</th>
                            <th>{TH_INFO}</th>
                            <th>{TH_TRACK}</th>
                        </tr>
                        {
                            listPhone
                                ? listPhone.map((item, index) => {
                                    // console.log(index, item);
                                    return <Row key={index}
                                        data={item}
                                        index={index}
                                    />
                                })
                                : null
                        }
                    </tbody>
                </table>

                <div className="divTextStatus"></div>

                <div className="input-add-div">
                    <input className="input-add"
                        type="text"
                        placeholder={TR_TYPE_NUMBER}
                        onChange={onInputPhone}
                    />
                    <input className="input-add" type="text" placeholder={TR_TYPE_MONEY} onChange={onInputMoney} />
                    <input className="input-add-button" type="button" value={TR_TYPE_ADD} onClick={addNew} />
                    {
                        warning == "" ?
                            <div>{warningPhone}</div>
                            :
                            <div>{warning}</div>
                    }
                </div>
                <div>
                </div>
                <div id="crawl_login_file_input_up">
                    {/* <img id="img_file_input" src='../assets/images/file.png' /> */}
                    <label htmlFor="xlsx">B???m v??o ????y ????? ch???n t???p(excel)</label>
                    <input type="file"
                        id="xlsx" name="xlsx"
                        accept="xlsx" onChange={readFile} />
                    <span id="span_file_input_error"></span>
                </div>

                <div id="crawl_login_file_input_down" onClick={downloadFile} >
                    {/* <img id="img_file_input" src='../assets/images/file.png' /> */}
                    <label htmlFor="avatar">B???m v??o ????y ????? t???i t???p(excel) m???u</label>
                </div>
                {
                    notiPhone && notiPhone.length > 0
                        ?
                        <div className="div-noti-phone-parent">
                            <span id="span-noti-phone">Thay ?????i m???i nh???t</span>
                            <div className="div-noti-phone">{
                                notiPhone ? notiPhone.map((item, index) => {
                                    //console.log("thay doi moi nhat",index, item);
                                    return <p key={index}>T??i kho???n ch??nh c???a thu?? bao <span className="noti-item-phone">{item.phone}</span> l?? <span className="noti-item-">{item.info}</span> (l???n h??n {item.money})</p>
                                })
                                    :
                                    null
                            }
                            </div>
                        </div>
                        :
                        null
                }


                <div className="div-progress-bar" id="div_progress_bar">
                    <div id="div_grey"></div>
                </div>
                <h4 id="success_text"></h4>
                <h4 id="error_crawl"></h4>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Ch???n crawl URL"
                subtitle=""
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
            >
                <div className="modal-header">
                    <h4>Ch???n ???????ng d???n ????? tra c???u</h4>

                </div>
                <div className="modal-body">
                    <form>
                        <p>
                            <input type="radio"
                                value={1}
                                checked={selectedURL == 1}
                                onChange={selectURL}
                            /> {url_1}
                        </p>
                        <p>
                            <input type="radio"
                                value={2}
                                checked={selectedURL == 2}
                                onChange={selectURL}
                            /> {url_2}
                        </p>
                        <p>
                            Th???i gian: <input className="input-time" type="number" placeholder="T???i thi???u 8s" onChange={changeTime} value={time} /> gi??y
                        </p>
                        <div style={{ textAlign: 'center' }}>
                            <input className="input-add-button" type="button" value="OK" onClick={closeModal} />
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );

}