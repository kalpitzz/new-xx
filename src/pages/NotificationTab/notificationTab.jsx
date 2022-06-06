import React, { useEffect, useState, useRef } from 'react';
import Style from './notification.module.css';
import useAxios from '../../hooks/useAxios';
import { Pagination } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
import usePagination from '../../components/Pagination/pagination';
const NotificationTab = () => {
  const AxiosApi = useAxios();
  const navigate = useNavigate();
  const readRef = useRef();
  const PER_PAGE = 10;
  const [notificationResponce, setNotificationResponce] = useState([]);
  const [compare, setCompare] = useState([]);
  const [dropIndex, setDropIndex] = useState(-1);
  const [readID, setReadID] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    AxiosApi.get('notifications/all/').then((res) => {
      setNotificationResponce(res);
      setCompare(res);
    });
  }, []);

  const handleMarkUnread = (id, status) => {
    let InitialStatus;
    compare.map((item) =>
      item.id === id ? (InitialStatus = item.status) : null
    );
    // console.log(id);
    // console.log(status);
    // console.log('init', InitialStatus);
    if (InitialStatus === 'read') {
      AxiosApi.patch(`notifications/mark-as-unread/${id}/`).then(() => {
        setReadID((prev) => prev.filter((item) => item !== id));
        setNotificationResponce((prev) =>
          prev.map((noti) =>
            noti.id === id ? { ...noti, status: 'unread' } : noti
          )
        );
      });
    } else {
      setReadID((prev) => prev.filter((item) => item !== id));
      setNotificationResponce((prev) =>
        prev.map((noti) =>
          noti.id === id ? { ...noti, status: 'unread' } : noti
        )
      );
    }
  };
  useEffect(() => {
    readRef.current = readID;
  }, [readID]);

  useEffect(() => {
    return () => {
      if (readRef.current.length > 0) {
        AxiosApi.patch('notifications/mark-as-read/', { id: readRef.current });
      }
    };
  }, []);

  const handleback = () => {
    navigate(-1);
  };

  const count = Math.ceil(notificationResponce.length / PER_PAGE);
  const data = usePagination(notificationResponce, PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    data.jump(p);
  };
  return (
    <main className={Style.mainWrap}>
      <div id={Style.title}>
        <i className="bx bx-left-arrow-alt bx-sm" onClick={handleback}></i>
        <h2>Notifications</h2>
        {console.log('readId', readID)}
      </div>
      {data.currentData().map((item, index) => (
        <div
          className={Style.card}
          key={index}
          onClick={(e) => {
            if (e.target.innerText !== 'Mark as Unread') {
              setReadID((prev) =>
                prev.includes(item.id) ? prev : [...prev, item.id]
              );
              setDropIndex((previndex) => (previndex === index ? -1 : index));
              if (dropIndex !== index && item?.status === 'unread') {
                setNotificationResponce((prev) =>
                  prev.map((noti) =>
                    noti.id === item.id ? { ...noti, status: 'read' } : noti
                  )
                );
              }
            }
          }}
        >
          <div className={Style.flexWrap}>
            <div>
              <div className={Style.TitleWrap}>
                {item?.status === 'read' ? (
                  <i
                    className="bx bxs-envelope-open bx-sm"
                    style={{ color: '#ec9b4f' }}
                  ></i>
                ) : (
                  <i
                    className="bx bxs-envelope bx-sm"
                    style={{ color: '#f9c94c' }}
                  ></i>
                )}
                <p>{item.subject}</p>
              </div>
              <p
                className={Style.notificationBody}
                style={{ display: dropIndex === index ? '' : 'none' }}
              >
                {item.body}
              </p>
            </div>
            <div className={Style.timeWrap}>
              <p>{item?.timesince}</p>
              {item?.status === 'read' ? (
                <button
                  id={Style.markUnread}
                  onClick={() => handleMarkUnread(item?.id, item?.status)}
                >
                  Mark as Unread
                </button>
              ) : null}
            </div>
            <i className={`bx bxs-down-arrow ${Style.dropArrow}`}></i>
          </div>
        </div>
      ))}
      <div className={Style.pagination}>
        <Pagination
          count={count}
          size="medium"
          page={page}
          variant="text"
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
    </main>
  );
};

export default NotificationTab;
