import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import TestiMonialInput from '../TestiMonialInputs'
import { useDispatch, useSelector } from 'react-redux'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { setUser } from '@/redux/userSlice'
import { useRouter } from 'next/navigation'
import RingSpinner from '../RingSpinner'

function HomeComment() {
    const [comment, setComment] = useState('')
    const [position, setPosition] = useState('Member')
    const [loading, setLoading] = useState(false)
    const [originalComment, setOriginalCOmment] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    function handleComment(e) {
        if (comment.length > 200){
            toast.warning('Maximum Characters exceeded')
            setComment(e.target.value.slice(0,200))
            return
        }
        setComment(e.target.value)
    }
    function handleCharWarning(){
        if (comment.length < 100){
            return 'green'
        }
        else if (comment.length > 150){
            return 'red'
        }
        else {
            return 'yellow'
        }
    }
    async function handleSubmit() {
        if (!user.isMember){
            toast.warning('Only Members can place a comment, please sign up first.')
            router.push('/')
        }
        setLoading(true)
        const docRef = await addDoc(collection(db, 'testimonial'), {
            comment,
            position,
            image: user.photoUrl,
            user: user.firstName + ' ' + user.lastName,           
        })
        const userRef = doc(db, "user", user.userRef);
        await updateDoc(userRef, { commentRef: docRef.id}); 
        dispatch(setUser({
            commentRef: docRef.id
        }))
        toast.success('Created Testimonial')      
        setLoading(false) 
    }
    async function handleUpdate() {
        setLoading(true)
        try {
          if (!user.commentRef) {
            toast.error('No testimonial found to update');
            return;
          }
      
          // Reference to the existing testimonial document
          const commentDocRef = doc(db, 'testimonial', user.commentRef);
      
          // Update the testimonial document with the new data
          await updateDoc(commentDocRef, {
            comment,
            position,
            image: user.photoUrl,
            user: user.firstName + ' ' + user.lastName,
          });
      
          toast.success('Testimonial updated successfully');
        } catch (error) {
          console.error('Error updating testimonial:', error);
          toast.error('Failed to update testimonial');
        }
        setLoading(false)
      }
      
    useEffect(()=>{
        setLoading(true)        
        const fetchComment = async () => {
            if (user.commentRef) {
              try {
                const commentDocRef = await doc(db, 'testimonial', user.commentRef);
                const docSnap = await getDoc(commentDocRef);
                
      
                if (docSnap.exists()) {
                  const data = docSnap.data(); // Save the data to local state
                  setComment(data.comment)
                  setPosition(data.position)
                  setOriginalCOmment(data.comment)
                  console.log(data, 'data')
                } else {
                  console.log('No such document!');
                }
              } catch (error) {
                console.error('Error fetching comment:', error);
              }
            }
          };
      
          fetchComment()
          setLoading(false)
    },[user.commentRef])
  return (
    <div className='homecomment-container'>
        <h4 className='homecomment-header'>As a member you may have one Testimonial for the home page.  This is not required, but we hope you take the time out to tell everyone how much you love our Church.  This comment will be displayed on the home page, so please make sure it is well though out, and editted properly.  You will be able to update/edit this comment anytime you wish.  Only members are allowed to make a comment on the home page.</h4>
        <div className='homecomment-comment-wrapper'>            
        <textarea className='homecomment-comment-text' placeholder='Maximum Characters of 200' onChange={(e)=>handleComment(e)} value={comment} />
            <span className='homecomment-comment-length'>(Max Characters: 200)  <span className={handleCharWarning()}>{comment.length} chars</span> </span>
        </div>
        <div className='homecomment-button-wrapper'>
            
            <div className='homecomment-input-label'>
                <div>
                <label>Position: </label>
                <input placeholder='Member' className='homecomment-position' value={position} onChange={(e)=>setPosition(e.target.value)} />
                </div>
                <span>Default Member, only change this is if you feel the position you are adding is a verified position.</span>
            </div>
            {loading && <RingSpinner />}
        {!user.commentRef ? <button className={comment.length > 0 ? 'filter-add homecomment-submit-buttom' : 'homecomment-submit-buttom'} onClick={handleSubmit}>Submit</button> :
        <button className={!(originalComment === comment) ? 'filter-add homecomment-submit-buttom' : 'homecomment-submit-buttom'} onClick={handleUpdate}>Update</button> }
        </div>
        <div className="hp1_testimonials_section">
        <div className="content_wrap">
        <div className="sc_testimonial_item">
                <TestiMonialInput comment={comment} image={user.photoUrl} position={position} user={user.firstName + ' ' + user.lastName} />
        </div>
    </div>
    </div>
    <h4 className='homecomment-preview-text'>Comment Preview</h4>
    </div>
  )
}

export default HomeComment