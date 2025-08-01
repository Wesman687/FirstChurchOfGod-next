import ManageFilters from '@/components/gallery/ManageFilters'
import ArrowUturnLeft from '@/components/icons/ArrowUturnLeftIcon'
import Layout from '@/components/Layout'
import { auth, db, storage } from '@/firebase'
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImageLightbox from '@/components/gallery/ImageLightbox'
import PeopleSearch from '@/components/gallery/PeopleSearch'
import EditImageModal from '@/components/gallery/EditImageModal'
import PublicImageUpload from '@/components/gallery/PublicImageUpload'
import PendingApprovals from '@/components/gallery/PendingApprovals'

function Gallery() {
    const [filter, setFilter] = useState('ALL')
    const [displayedImages, setDisplayedImages] = useState([])
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [images, setImages] = useState([])
    const [displayGallery, setDisplayGallery] = useState(true)
    const [displayFilters, setDisplayFilters] = useState(false)
    const [displayPublicUpload, setDisplayPublicUpload] = useState(false)
    const [displayPendingApprovals, setDisplayPendingApprovals] = useState(false)
    const [filters, setFilters] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const [searchResults, setSearchResults] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingImage, setEditingImage] = useState(null)

    function handleEdit(item) {
        setEditingImage(item);
    }

    async function handleDelete(item) {
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
            const unsubscribe = onSnapshot(q2, (snapshot) => {
                const data = snapshot.docs
                const imagesWithIds = data.map((item) => ({
                    id: item.id,
                    ...item.data()
                }))
                setImages(imagesWithIds)
                setDisplayedImages(imagesWithIds)
            })
        } else {
            console.log('No document found with that link.');
        }
    }

    function handleFilter(e) {
        const value = e.target.value
        setFilter(value)
        setSearchResults(null) // Clear search results when changing filter
        setSearchQuery('')
        
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

    function handleImageClick(item, index) {
        setSelectedImage(item)
        setLightboxIndex(index)
    }

    function handleNextImage() {
        const currentImages = searchResults || displayedImages
        const nextIndex = (lightboxIndex + 1) % currentImages.length
        setLightboxIndex(nextIndex)
        setSelectedImage(currentImages[nextIndex])
    }

    function handlePrevImage() {
        const currentImages = searchResults || displayedImages
        const prevIndex = lightboxIndex === 0 ? currentImages.length - 1 : lightboxIndex - 1
        setLightboxIndex(prevIndex)
        setSelectedImage(currentImages[prevIndex])
    }

    function handleSearchResults(imageUrls, query) {
        setSearchQuery(query)
        if (imageUrls.length > 0) {
            const searchedImages = images.filter(image => imageUrls.includes(image.link))
            setSearchResults(searchedImages)
        } else {
            setSearchResults([])
        }
    }

    function handleClearSearch() {
        setSearchResults(null)
        setSearchQuery('')
    }

    function handleUpdateImage() {
        // Refresh the images list after editing
        const q2 = query(collection(db, 'images'))
        const unsubscribe = onSnapshot(q2, (snapshot) => {
            const data = snapshot.docs
            const imagesWithIds = data.map((item) => ({
                id: item.id,
                ...item.data()
            }))
            setImages(imagesWithIds)
            setDisplayedImages(imagesWithIds)
        })
        return unsubscribe;
    }

    function handleManageFilters() {
        if (displayPublicUpload) {
            setDisplayPublicUpload(false)
        }
        if (displayPendingApprovals) {
            setDisplayPendingApprovals(false)
        }
        if (user.isAdmin) {
            setDisplayGallery(false)
            setDisplayFilters(true)
        }
    }

    function handlePublicUpload() {
        if (displayFilters) {
            setDisplayFilters(false)
        }
        if (displayPendingApprovals) {
            setDisplayPendingApprovals(false)
        }
        setDisplayGallery(false)
        setDisplayPublicUpload(true)
    }

    function handlePendingApprovals() {
        if (displayFilters) {
            setDisplayFilters(false)
        }
        if (displayPublicUpload) {
            setDisplayPublicUpload(false)
        }
        if (user.isAdmin) {
            setDisplayGallery(false)
            setDisplayPendingApprovals(true)
        }
    }

    function goBack() {
        setDisplayGallery(true)
        if (displayFilters) {
            setDisplayFilters(false)
        }
        else if (displayPublicUpload) {
            setDisplayPublicUpload(false)
        }
        else if (displayPendingApprovals) {
            setDisplayPendingApprovals(false)
        }
    }

    useEffect(() => {
        const q = query(collection(db, 'filters'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
            const inputs = data.map((item) => (item.data().filter))
            setFilters(inputs)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        const q2 = query(collection(db, 'images'))
        const unsubscribe = onSnapshot(q2, (snapshot) => {
            const data = snapshot.docs
            const imagesWithIds = data.map((item) => ({
                id: item.id,
                ...item.data()
            }))
            setImages(imagesWithIds)
            setDisplayedImages(imagesWithIds)
        })
        return unsubscribe
    }, [])

    return (
        <>
            <Layout>
                <div className="gallery-wrapper">
                    <h1 className="page_title">Gallery</h1>
                
                    {/* People Search */}
                    <PeopleSearch 
                        onSearchResults={handleSearchResults}
                        onClearSearch={handleClearSearch}
                    />

                    {/* Search Results Header */}
                    {searchResults !== null && (
                        <div className="search-results-header">
                            {searchQuery && (
                                <h3>
                                    {searchResults.length > 0 
                                        ? `Found ${searchResults.length} photo${searchResults.length !== 1 ? 's' : ''} with "${searchQuery}"`
                                        : `No photos found with "${searchQuery}"`
                                    }
                                </h3>
                            )}
                        </div>
                    )}
                
                    <div className='manage-filter-container'>
                        <select onChange={(e) => handleFilter(e)} value={filter} className='gallery-filter-box'>
                            <option value='ALL'>All</option>
                            {filters.length > 0 && filters.map((item, index) => (
                                <option value={item} key={index}>{item}</option>
                            ))}
                        </select>
                        
                        <div className='manage-filter-arrow-container'>
                            <div className='manage-buttons-container'>
                                {(user.isAdmin || user.isMember) && (
                                    <div>
                                        {!displayPublicUpload ? (
                                            <label className='manage-filters-label' onClick={handlePublicUpload}>
                                                Upload Photo
                                            </label>
                                        ) : (
                                            <label className='manage-filters-label-active'>Upload Photo</label>
                                        )}
                                    </div>
                                )}

                                {user.isAdmin && (
                                    <>
                                        <div>
                                            {!displayFilters ? (
                                                <label className='manage-filters-label' onClick={handleManageFilters}>
                                                    Manage Gallery Names
                                                </label>
                                            ) : (
                                                <label className='manage-filters-label-active'>Manage Gallery Names</label>
                                            )}
                                        </div>
                                        <div>
                                            {!displayPendingApprovals ? (
                                                <label className='manage-filters-label' onClick={handlePendingApprovals}>
                                                    Pending Approvals
                                                </label>
                                            ) : (
                                                <label className='manage-filters-label-active'>Pending Approvals</label>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {(displayFilters || displayPublicUpload || displayPendingApprovals) && (
                                <div className='gallery-back-arrow' onClick={goBack}>
                                    <ArrowUturnLeft />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='gallery-image-container'>
                        {/* Display search results or filtered images */}
                        {((searchResults || displayedImages).length > 0 && displayGallery) && (searchResults || displayedImages).map((item, index) => (
                            <div className="esg-media-cover-wrapper" key={index}>
                                <div 
                                    className="esg-entry-media" 
                                    Loading="lazy"
                                    onClick={() => handleImageClick(item, index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img className='gallery-image' src={item.link} alt={item.desc || ""} />
                                </div>
                                {user.isAdmin && (
                                    <div className='gallery-image-label-container'>
                                        <label className='gallery-image-label' onClick={() => handleEdit(item)}>Edit</label>
                                        <label className='gallery-image-label' onClick={() => handleDelete(item)}>Delete</label>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {displayFilters && <ManageFilters />}
                        {displayPublicUpload && <PublicImageUpload />}
                        {displayPendingApprovals && <PendingApprovals />}
                    </div>

                    {/* Lightbox */}
                    {selectedImage && (
                        <ImageLightbox
                            image={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            onNext={handleNextImage}
                            onPrev={handlePrevImage}
                        />
                    )}

                    {/* Edit Modal */}
                    {editingImage && (
                        <EditImageModal
                            image={editingImage}
                            onClose={() => setEditingImage(null)}
                            onUpdate={handleUpdateImage}
                        />
                    )}
                </div>
            </Layout>
        </>
    )
}

export default Gallery