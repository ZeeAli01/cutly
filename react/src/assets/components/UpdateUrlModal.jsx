import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaEdit } from "react-icons/fa";
function UpdateUrlModal({ id, handleUrlUpdateButton }) {
  const today = new Date().toISOString().split('T')[0];
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, [localStorage.getItem("accessToken")]);
  const username = localStorage.getItem("username");
  const [prevData, setPrevData] = useState({});//url object before update
  const [shortUrl, setShortUrl] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const [originalUrl, setOriginalUrl] = useState();
  const [status, setStatus] = useState();
  const [urlType, setUrlType] = useState();
  const [tagName,setTagName]=useState();
  const [tags,setTags]=useState([]);
  const [tagId,setTagId]=useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  useEffect(() => {
    if (show) {
      
       const fetchUrlData = async () => {
      const url_id=id;
      console.log("URL ID = ",url_id);
      try {
        const response = await fetch(`http://localhost:3000/api/urls/${url_id}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
                throw new Error("Network response was not ok");
              }
        const url = await response.json();
        setPrevData(url);
        setShortUrl(url.short_url);
      
        setExpirationDate(url.expiration_date);
        setOriginalUrl(url.original_url);
        setStatus(url.status);
        setUrlType(url.url_type);
        fetchTags();
        if (url.urltag) {
          setTagName(url.urltag.tag_name);
          setTagId(url.urltag.tag_id); 
          console.log("URL TAG NAME = ",url.urltag.tag_name)
        }
        console.log("PREV URL = ",url);
        
      } catch (error) {
        console.error("Error fetching url:", error);
      }
    }
    fetchUrlData();
  }
  }, [show]);

  const fetchTags=async()=>{
    try {
      const response = await fetch(`http://localhost:3000/api/urltags?username=${username}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
       
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const Tags = await response.json();
      setTags(Tags);
      console.log("TAGS = ",Tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
 }
  return (
    <>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary row-update-button"
      >
        <FaEdit />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              handleClose();
              e.preventDefault();
              handleUrlUpdateButton(id, {url_type:urlType,status:status,expiration_date:new Date(expirationDate),original_url:originalUrl,tag_id:+tagId});
            }}
            id="modal-form-url-update"
            className="w-full max-w-sm"
          >
            {/* original url */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="original-url-updateModal"
                >
                  <strong> Original:</strong>
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="original-url-updateModal"
                  name="original-url-updateModal"
                  type="url"
                  placeholder={originalUrl}
                  value={originalUrl}
                  onChange={(e) => {
                    setOriginalUrl(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* expiration date */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="expiration-date-updateModal"
                >
                  <strong>Expiration:</strong>
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="date"
                  min={today}
                  id="expiration-date-updateModal"
                  name="expiration-date-updateModal"
                  value={expirationDate}
                  onChange={(e) => {
                    setExpirationDate(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* status */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="status-updateModal"
                >
                  <strong>Status:</strong>
                </label>
              </div>
              <div className="md:w-2/3">
                <select
                  name="status-updateModal"
                  id="status-updateModal"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  required
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {/* type */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="type-updateModal"
                >
                  <strong>Type:</strong>
                </label>
                </div>
                <div className="md:w-2/3">
                <select
                  name="type-updateModal"
                  id="type-updateModal"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  required
                  value={urlType}
                  onChange={(e) => {
                    setUrlType(e.target.value);
                  }}
                >
                  <option value="store">Store</option>
                  <option value="product">Product</option>
                  <option value="misc">Misc</option>
                </select>
              </div>
              </div>
              {/* url tag */}
                  
              <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="tag-updateModal"
                >
                  <strong>Tag:</strong>
                </label>
                </div>
                <div className="md:w-2/3">
                <select
                  name="tag-updateModal"
                  id="tag-updateModal"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  value={tagId}
                  onChange={(e) => {
                    // setTagName(e.target.value);
                    setTagId(e.target.value);
                  }}
                >
                  {
                    tags?.map((tag) => <option value={tag.tag_id}>{tag.tag_name}</option>)
                  }
                </select>
              </div>
              </div>
              
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button
            className="btn btn-primary row-update-button"
            form="modal-form-url-update"
          >
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateUrlModal;
