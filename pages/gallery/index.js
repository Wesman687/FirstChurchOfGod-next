import AddImages from '@/components/gallery/AddImages'
import ManageFilters from '@/components/gallery/ManageFilters'
import ArrowUturnLeft from '@/components/icons/ArrowUturnLeftIcon'
import Layout from '@/components/Layout'
import { auth, db, storage } from '@/firebase'
import { collection, deleteDoc, doc, getDocs, onSnapshot,  query, where } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'




function Gallery() {
    const [filter, setFilter] = useState('ALL')
    const [displayedImages, setDisplayedImages] = useState([])
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [images, setImages] = useState([])
    const [displayGallery, setDisplayGallery] = useState(true)
    const [displayFilters, setDisplayFilters] = useState(false)
    const [displayAddImages, setDisplayAddImages] = useState()
    const [filters, setFilters] = useState([])
    
    function handleEdit(){
        

    }
    async function handleDelete(item){
        const temp = item.link.slice(93)
        const imageName = temp.slice(0, temp.indexOf('?'))
        const imageRef = await ref(storage, `images/${imageName}`)
        await deleteObject(imageRef)
        let imagesRef = await collection(db, "images");
        const q = await query(imagesRef, where("link", "==", item.link)); 
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, 'images', docSnapshot.id);                
                await deleteDoc(docRef);
            });             
            const q2 = await query(collection(db, 'images'))
            const unsubscribe = onSnapshot(q2, (snapshot) =>{
                const data = snapshot.docs
                const inputs = mapLinks(data)
                setImages(data.map((item)=>item.data()))
                setDisplayedImages(inputs)
            })
        } else {
            console.log('No document found with that link.');
        }
    
}


    
    function handleFilter(e) {
        const value = e.target.value
        setFilter(value)
        if (value === 'ALL') {
            setDisplayedImages(images)
            
        }
        else {
            setDisplayedImages(images.filter((item) => {
                if (item.gallery === value) {
                    return item.link
                }
            }))
        }
    }
    function handleManageFilters(){
        if (displayAddImages) {
            setDisplayAddImages(false)
        }
        if (user.isAdmin){
            setDisplayGallery(false)
            setDisplayFilters(true)
        }
        
    }
    function handleAddImage(){
        if (displayFilters){
            setDisplayFilters(false)
        }
        if (user.isAdmin){
            setDisplayGallery(false)
            setDisplayAddImages(true)
        }
    }
    function goBack(){
        setDisplayGallery(true)
        if (displayAddImages){
            setDisplayAddImages(false)
        }
        else if (displayFilters){
            setDisplayFilters(false)
        }
        
    }
    function mapLinks(data){
        return data.map((item)=>( item.data()))
    }

    useEffect(()=>{
        const q = query(collection(db, 'filters'))                
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            const data = snapshot.docs
            const inputs = data.map((item)=>( item.data().filter))
            setFilters(inputs)
        })
        return unsubscribe
    },[])
    useEffect(()=> {
        const q2 = query(collection(db, 'images'))          
        const unsubscribe = onSnapshot(q2, (snapshot) =>{
            const data = snapshot.docs
            const inputs = mapLinks(data)
            setImages(data.map((item)=>item.data()))
            setDisplayedImages(inputs)
        })
        return unsubscribe
    }, [])
    console.log(displayedImages)

    return (
        <>
            <Layout>
                <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                    <div className="top_panel_title_inner top_panel_inner_style_3 gallery-header breadcrumbs_block_bg3">
                        <div className="content_wrap">
                            <h1 className="page_title">Gallery</h1>
                        </div>
                    </div>
                </div>
                <div className="page_content_wrap page_paddings_no">
                    <div className="content_wrap">
                        <div className="content">
                            <article className="post_item post_item_single page">
                                <section className="post_content tpl_gallery_section">
                                    <article className="myportfolio-container gallery" id="esg-grid-2-1-wrap">

                                        <div id="esg-grid-2-1" className="esg-grid">
                                            <article className="esg-filters esg-singlefilters grid-filters margin_bottom_20">
                                                <div className="esg-filter-wrapper esg-fgc-2 margin_right_3 margin_left_3">
                                                    <div className='manage-filter-container'>
                                                    <select onChange={(e) => handleFilter(e)} value={filter} className='gallery-filter-box'>
                                                        <option value='ALL'>All</option>
                                                        {filters.length > 0 && filters.map((item, index) => (
                                                            <>
                                                        <option value={item} key={index}>{item}</option>
                                                        </>))}
                                                    </select>
                                                    {user.isAdmin && <div className='manage-filter-arrow-container'>
                                                        <div className='manage-buttons-container'>
                                                            <div>                                                    
                                                    {!displayFilters ? <label className='manage-filters-label' onClick={handleManageFilters}>Manage Gallery Names</label> :
                                                    <label className='manage-filters-label-active'>Manage Gallery Names</label>                                                 
                                                    }
                                                    </div>
                                                    <div>
                                                    
                                                    {!displayAddImages ? <label className='manage-filters-label' onClick={handleAddImage}>Add Images</label> :
                                                    <label className='manage-filters-label-active'>Add Images</label>                                                 
                                                    }
                                                    </div>
                                                    </div>
                                                    
                                                    {displayFilters && 
                                                    <>                                                    
                                                    <div className='gallery-back-arrow' onClick={goBack}>
                                                        <ArrowUturnLeft />
                                                    </div>
                                                    </>}
                                                    {displayAddImages && 
                                                    <>                                                    
                                                    <div className='gallery-back-arrow' onClick={goBack}>
                                                        <ArrowUturnLeft />
                                                    </div>
                                                    </>}
                                                    </div>}
                                                    
                                                    </div>
                                                    

                                                    
                                                </div>
                                            </article>
                                            <div className='gallery-image-container'>
                                                {(displayedImages.length > 0 && displayGallery) && displayedImages.map((item, index) => (
                                                    <div className="esg-media-cover-wrapper" key={index}>
                                                        <div className="esg-entry-media">
                                                            <img className='gallery-image' src={item.link} alt="" />
                                                        </div>
                                                        {user.isAdmin && <div>
                                                            <label className='gallery-image-label' onClick={()=>handleEdit(item)}>Edit</label>
                                                            <label className='gallery-image-label' onClick={()=>handleDelete(item)}>Delete</label>
                                                        </div>}
                                                    </div>
                                                ))}
                                                {displayFilters && <ManageFilters />}
                                                {displayAddImages && <AddImages filters={filters} />}
                                            </div>
                                        </div>
                                    </article>

                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Gallery