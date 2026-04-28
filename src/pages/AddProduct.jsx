import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CrossIcon, PhotoIcon } from "../icons";
import useProductStore from "../stores/product.store.js";
import useAuctionStore from "../stores/auction.store.js";
import useUserStore from "../stores/user.store.js";
import Swal from "sweetalert2";
import { uploadMultipleToCloudinary } from '../utils/uploadCloud.js'
import { apiCreateImages } from "../api/apiMain.js";

const AddProduct = () => {
  const { createProduct, allCategories, updateProduct, createImages } =
    useProductStore();
  const { allAuction, getAllAuction, createAuction, getAuctionByProductId } = useAuctionStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]) // เก็บไฟล์ที่จะอัปโหลด
  const [previews, setPreviews] = useState([]); // เก็บ URL สำหรับแสดงตัวอย่างภาพ (preview)
  const { register, handleSubmit, reset, watch, setValue, getValues, formState } = useForm(
    {
      // resolver: zodResolver(editProfileSchema),
      mode: "onSubmit",
      defaultValues: {
        images: []
      }
    },
  );

  const { isDirty } = formState

  const imagesFile = watch('images')

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const {
      description,
      name,
      startTime,
      durationEndTime,
      startingPrice,
      reservePrice,
      minIncrement,
      category,
      images
    } = data;
    // const selectedCategory = allCategories.find(c => c.name === data.categoryName);

    setIsLoading(true);
    // console.log("user", user);
    const start = new Date(startTime);
    console.log('start', start)

    // 2. Calculate End Date: Start (in ms) + (Hours * ms in an hour)
    const durationInMs = Number(durationEndTime) * 60 * 60 * 1000;
    const end = new Date(start.getTime() + durationInMs);
    console.log('end', end)
    try {

      const imageUrls = await uploadMultipleToCloudinary(images);
      console.log('imageUrls', imageUrls)


      const productTableData = {
        description,
        name,
        categoryId: Number(category),
        // sellerId: user.id,
      };
      const newProduct = await createProduct(productTableData);

      // 3. ส่ง URL พร้อม productId ไปบันทึก (Table Images)
      const imagePayload = imageUrls.map(url => ({
        imageUrl: url,
        productId: newProduct.id
      }));
      console.log('imagePayload', imagePayload)

      for (const item of imagePayload) {
        createImages(item);
      }

      //api add images to db
      // const resp = createImages(imagePayload)
      // console.log('imagesssss')

      const auctionTableData = {
        // Converts to 2026-04-22T12:31:00.000Z
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        startingPrice: Number(startingPrice),
        reservePrice: Number(reservePrice),
        minIncrement: Number(minIncrement),
        productId: newProduct.id,
        status: "WAITING"
      };
      const auctionAfterCreated = await createAuction(auctionTableData);
      console.log('auctionAfterCreated', auctionAfterCreated)
      console.log('newProduct.id', newProduct.id)
      const filterAuctionByProductId = auctionAfterCreated.filter((item) => item.productId === newProduct.id)
      console.log('filterAuctionByProductId', filterAuctionByProductId)

      Swal.fire({
        title: "Product created!",
      });
      navigate("/seller_products")
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed to create product",
      });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    const currentFiles = watch("images") || [];

    if (currentFiles.length + newFiles.length > 5) {
      Swal.fire({
        text: "สามารถอัปโหลดรูปภาพได้สูงสุด 5 รูป"
      })

      e.target.value = null; // ล้างค่า input เพื่อให้เลือกใหม่ได้
      return;
    }

    // 2. รวมรูปเก่า + รูปใหม่
    const updatedFiles = [...currentFiles, ...files];
    // console.log('updatedFiles', updatedFiles)

    // 3. อัปเดตกลับเข้าไปใน useForm
    setValue("images", updatedFiles);

    // 4. ทำ Preview (ใช้ State แยกสำหรับเก็บ URL blob จะจัดการง่ายกว่า)
    const newPreviews = newFiles?.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);

    e.target.value = null; // ล้างค่า input เพื่อให้เลือกซ้ำได้
  };

  const removePic = e => {
    if (e) e.stopPropagation();

    const inputFile = document.getElementById('input-file');
    if (inputFile) inputFile.value = '';

    setImages([]);
    setPreviews([]);
  }

  const removeSpecific = (index) => {
    const currentFiles = getValues("images") || [];
    // console.log('currentFiles', currentFiles)
    const filteredFiles = currentFiles.filter((_, i) => i !== index);
    // console.log('filteredFiles', filteredFiles)
    setValue("images", filteredFiles, { shouldValidate: true });

    // ลบใน Preview State
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-['Manrope'] selection:bg-[#9e1b1b] selection:text-white">
      <main className="pt-8 pb-24 px-6 md:px-24 max-w-[1440px] mx-auto">
        {/* Two Column Layout */}
        <form action="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Side: Forms */}
            <div className="lg:col-span-7 space-y-24">
              {/* Section 1: Identification */}
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-['Newsreader'] text-3xl italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    1
                  </span>
                  <h2 className="font-['Newsreader'] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Product Detail
                  </h2>
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("name")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Category
                    </label>
                    <select
                      onChange={(e) => console.log(e.target.value)}
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-2 text-base focus:ring-0 focus:border-[#7a0009] transition-all appearance-none"
                      {...register("category")}
                    >
                      <option>Select a category</option>
                      {allCategories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      placeholder="product details"
                      className="border-1 border-[#8d706d]/30 bg-transparent px-3 py-3 text-base focus:ring-0 focus:border-[#7a0009] transition-all resize-none"
                      {...register("description")}
                    ></textarea>
                  </div>
                </div>
                {/* </form> */}
              </section>

              <section>
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-['Newsreader'] text-3xl italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    2
                  </span>
                  <h2 className="font-['Newsreader'] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Auction Detail
                  </h2>
                </div>
                {/* <form action=""> */}
                <div className="space-y-8 grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      placeholder=""
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("startTime")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      End Time
                    </label>
                    <select
                      name="durationEndTime"
                      className="min-h-[37px] border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("durationEndTime")}
                    >
                      <option value="24">1 day</option>
                      <option value="72">3 day</option>
                      <option value="120">5 day</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Starting Price (Bath)
                    </label>
                    <input
                      type="text"
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("startingPrice")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Reserve Price (Bath)
                    </label>
                    <input
                      type="text"
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("reservePrice")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-dark-red mb-2 font-bold">
                      Minimum Increment (Bath)
                    </label>
                    <input
                      type="text"
                      className="border-0 border-b border-[#8d706d]/30 bg-transparent px-2 py-1 font-['Newsreader'] text-lg focus:ring-0 focus:border-[#7a0009] transition-all placeholder:text-[#59413e]/30"
                      {...register("minIncrement")}
                    />
                  </div>
                </div>
                {/* </form> */}
              </section>
            </div>

            {/* Right Side: Media & Context */}
            <div className="lg:col-span-5 space-y-12">
              <div className="bg-white p-8 border border-[#e1bebb]/15 rounded-sm">
                <h3 className="font-['Newsreader'] text-xl mb-8 bg-gradient-to-r from-dark-red to-secondary bg-clip-text text-transparent">
                  Product Images
                </h3>
                <div>
                  <div className="flex justify-center items-center col-span-3 aspect-[4/3] bg-[#e4e2df] rounded-sm overflow-hidden relative group mb-3">
                    {previews.length > 0 ? (
                      <>
                        {/* ดึงรูปแรก previews[0] มาแสดง */}
                        <img src={previews[0]} alt="main" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button type="button" onClick={(e) => { removeSpecific(0) }} className="text-white">
                            <CrossIcon className="w-10" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="material-symbols-outlined text-[#59413e]/30">
                        <PhotoIcon className="w-30" />
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[0, 1, 2, 3].map((e, i) => {
                      // เราเริ่มนับรูปที่ 2 (index + 1) เพราะรูปแรกโชว์ในช่องใหญ่ไปแล้ว
                      const currentImage = previews[i + 1];

                      return (
                        <div
                          key={i}
                          className="aspect-square bg-[#e4e2df]/40 rounded-sm flex items-center justify-center border-2 border-dashed border-[#e1bebb]/40 overflow-hidden relative group"
                        >
                          {currentImage ? (
                            <>
                              <img src={currentImage} className="w-full h-full object-cover" alt={`sub-preview-${i}`} />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button type="button" onClick={(e) => { removeSpecific(i + 1); }} className="">
                                  <CrossIcon className="relative w-10" />
                                </button>
                              </div>
                            </>

                          ) : (
                            <span className="material-symbols-outlined text-[#59413e]/30">
                              <PhotoIcon className="w-10" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border-2 border-dashed border-[#e1bebb]/40 py-12 px-6 flex flex-col items-center text-center cursor-pointer hover:bg-[#efeeeb] transition-colors"
                  onClick={() => document.getElementById('input-file').click()}>
                  <input type="file" className='hidden' id='input-file' multiple
                    onChange={handleFileChange} />
                  {images.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-3xl text-green-600 mb-4">
                        check_circle
                      </span>
                      <p className="text-sm font-semibold mb-1">
                        Selected {images.length} files
                      </p>
                      <button type="button"
                        className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                        onClick={(e) => {
                          removePic(); // ฟังก์ชันล้างรูปทั้งหมด
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  )
                    : (
                      // แสดง UI ปกติเมื่อยังไม่มีรูป
                      <>
                        <span className="material-symbols-outlined text-3xl text-[#7a0009] mb-4">
                          cloud_upload
                        </span>
                        <p className="text-sm font-semibold mb-1">
                          Drag & drop files here
                        </p>
                        <p className="text-xs text-[#59413e]">
                          PNG, JPG or JPEG (max. 10MB)
                        </p>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-center items-center gap-6 pt-30">
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-gradient-to-br from-dark-red to-red-600 text-white px-8 py-4 rounded-sm text-sm font-bold tracking-widest uppercase hover:shadow-lg hover:shadow-[#7a0009]/20 transition-all active:scale-[0.98]"
          >
            Create New Product
          </button>
          <button className="text-white bg-gradient-to-r from-primary to-secondary text-on-primary w-30 py-4 rounded-l hover:text-[#7a0009] transition-colors text-sm font-bold tracking-widest uppercase decoration-[#e1bebb]/30">
            Save Draft
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
