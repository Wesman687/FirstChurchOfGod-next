import React, { useRef, useState } from 'react'
import UploadIcon from '../icons/UploadIcon'
import { db, storage } from '@/firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import PeopleMentionsInput from './PeopleMentionsInput'
import { toast } from 'react-toastify'

function AddImages({ filters }) {
    const [image, setImage] = useState()
    const filePickerRef = useRef(null)
    const [filter, setFilter] = useState(filters[0])
    const [desc, setDesc] = useState('')
    const [peopleMentions, setPeopleMentions] = useState([])
    const [loading, setLoading] = useState(false)
    function addImage(e) {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.addEventListener("load", e => {
            setImage(e.target.result)
        })

    }

    async function handleAdd() {
        if (!image) {
            toast.error('Please select an image first');
            return;
        }

        setLoading(true);
        let downloadURL;
        
        try {
            if (image) {
                const string = generateRandomStringWithDate()
                console.log(string)
                const imageRef = await ref(storage, `images/${string}`)
                const uploadImage = await uploadString(imageRef, image, "data_url")
                downloadURL = await getDownloadURL(imageRef)
            }
            
            // Save image metadata to Firestore
            const docRef = await addDoc(collection(db, 'images'), {
                link: downloadURL,
                timeStamp: new Date(),
                gallery: filter,
                desc,
                peopleMentions: peopleMentions || []
            });

            // Save people mentions to the people collection
            if (peopleMentions && peopleMentions.length > 0) {
                const mentionPromises = peopleMentions.map(mention => {
                    return fetch('/api/image-people-mentions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: mention.name,
                            context: mention.context,
                            media_url: downloadURL,
                            date: new Date().toISOString()
                        })
                    });
                });

                await Promise.all(mentionPromises);
            }

            // Reset form
            setImage(null);
            setDesc('');
            setPeopleMentions([]);
            toast.success('Image added successfully with people mentions!');

        } catch (error) {
            console.error('Error adding image:', error);
            toast.error('Error adding image. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    function generateRandomStringWithDate() {
        const now = new Date();
        const timestamp = now.getTime(); // Get milliseconds since epoch
        const randomPart = Math.random().toString(36).substr(2, 6); // Generate random string

        return `image_${timestamp}_${randomPart}`;
    }

    return (
        <div className='add-image-container'>
            <div>
                {image ?
                    <div className='add-image-wrapper' onClick={() => filePickerRef.current.click()}>
                        <img src={image} alt={'new image'} className='new-image' />
                        <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />

                    </div>
                    :
                    <div className='add-image-template-wrapper'>
                        <div className='add-image-template' onClick={() => filePickerRef.current.click()}>
                            <label>2400 x 1200</label>
                            <div className='add-image-upload-wrapper' >
                                <UploadIcon />

                            </div>
                        </div>
                        <input onChange={addImage} ref={filePickerRef} className="hidden" type="file" />
                    </div>}
            </div>
            {image &&
                <div className='add-image-details-container'>
                    <div className='add-image-details-wrapper'>
                        <div>
                            <label className='add-image-labels'>Select Gallery: </label>
                            <select onChange={(e) => setFilter(e.target.value)} value={filter} className='gallery-filter-box'>
                                {filters.length > 0 && filters.map((item, index) => (
                                    <>
                                        <option value={item} key={index}>{item}</option>
                                    </>))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className='add-image-labels'>Desc:</label>
                        <textarea 
                            className='add-image-desc' 
                            value={desc} 
                            onChange={(e) => setDesc(e.target.value)} 
                            placeholder='Description' 
                        />
                    </div>

                    {/* People Mentions Input */}
                    <PeopleMentionsInput 
                        peopleMentions={peopleMentions}
                        onPeopleMentionsChange={setPeopleMentions}
                    />

                    <div className='gallery-add-image-button-wrapper'>
                        <button 
                            className={`orange-btn gallery-add-image-button ${loading ? 'loading' : ''}`}
                            onClick={handleAdd}
                            disabled={loading}
                        >
                            {loading ? 'Adding Image...' : 'Add Image'}
                        </button>
                    </div>

                </div>}


        </div>
    )
}

export default AddImages