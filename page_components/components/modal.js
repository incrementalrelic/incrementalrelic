import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmModal(props) {
    const [show, setShow] = useState(true);
  
    const handleClose = () => {
        setShow(false)
        props.onClose()
    }

    const handleShow = () => setShow(true);
  
    return (
        <Modal dialogClassName="box-modal" show={show} onHide={handleClose}>
          <div style={{backgroundColor:"#333333", color:"white", fontWeight:'bold'}}>
            <Modal.Header>
              <Modal.Title style={{fontWeight:'bold'}}>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
              <Button style={{color: "white", fontWeight:"bold", backgroundColor:"#494949", borderColor:"#494949"}} onClick={handleClose}>
                Ok
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
    );
}
  