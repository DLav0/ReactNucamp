import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


function RenderCampsite({campsite}) {
    return (
        <div className='col-md-5 m-1'>
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

function RenderComments({comments, addComment, campsiteId}) {

// console.log(comments)

if (comments) {
    return (
        <div className='col-md-5 m-1'> 
            <h4>Comments</h4>
            {comments.map((comment) => {
                return (
                    
                    <div className='row'>
                        <p>{comment.text}<br/>
                        -- {comment.author}, {' '}
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                    </div>
                    
                    
                )})
            }
            <CommentForm campsiteId={campsiteId} addComment={addComment}/>
        </div>
    )
}  
else {}
}   




function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments} 
                        addComment={props.addComment}
                        campsiteId={props.campsite.id}
                    />
              
                </div>

            </div>
        );
    }
    return <div />;
}

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
          
          isModalOpen: false
        };
    }

    toggleModal = () => {
        this.setState({
            isModalOpen:  !this.state.isModalOpen
        });
    }

    handleSubmit = (values) => {
        this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
      };

    
    render() {
        
        return (


       
        <div>
            <Button onClick={this.toggleModal} className="fa fa-pencil fa-lg" outline>
             Submit Comment
            </Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(valuesObj) => this.handleSubmit(valuesObj)}>
                        <div className="form-group">
                        <label htmlFor="contactType">
                                Rating
                        </label>
                        <Control.select model=".rating" id="contactType" name="contactType"
                            className="form-control" defaultValue="1">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Control.select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="name">
                                Your Name
                            </label>
                            <Control.text 
                            model=".author"
                            id="name"
                            name="name"
                            className="form-control"
                            validators={{
                                required: (val) => val && val.length > 0,
                                minLength: (val) => val && val.length > 2,
                                maxLength: (val) => val && val.length <= 15
                            }}
                            />
                            <Errors className="text-danger" model=".author" show="touched" component="div"
                                messages={{
                                    required: "Required",
                                    minLength: "Must be 2 letters",
                                    maxLength: "must be less than 15 characters"
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">
                                Comment
                            </label>
                            <Control.textarea
                            model=".text"
                            id="comment"
                            name="comment"
                            className="form-control"
                            rows="6"
                            />

                        </div>
                        <Button type="submit" color="primary">
                            Submit
                        </Button>
                    </LocalForm>
                </ModalBody>
            </Modal>

        </div>

        )
    }
}

export default CampsiteInfo