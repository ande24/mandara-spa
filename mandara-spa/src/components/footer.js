"use client"

import Image from "next/image";

const Footer = () => {
    const thelink = "https://apexeldevelopment.com/?fbclid=IwZXh0bgNhZW0CMTEAAR3hqnud5A9vvZNNDy5XGnNh6dxFkM1Z6AaH9f7nZyMDcgeQCWzCJvQ8YiI_aem_Ij_lDZZcc9U_3IjhJIrNog";

return (
    <footer className="bg-[#502424] h-50">
  <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div>
        
        <a href="/user/about">
            <Image
                src="/images/mandara_gold.png"
                alt=""
                height={150}
                width={300}
                className=" mb-4 object-contain scale-80 hover:scale-85 transition-all"
            />
        </a>

        <p className="mt-4 max-w-xs text-justify text-[#e0d8ad]">
        The Mandara Spa has elevated the spa experience to a new art form. We offer our guests a personalized experience showcasing the warmth of Filipino hospitality, genuine service and a wide array of carefully curated Rituals that The Mandara Spa has been well distinguished for.
        </p>

        <ul className="mt-8 flex mrjustify-center gap-6">

          <li>
            <a href="/user/contact" className="text-[#e0d8ad] transition hover:opacity-75">Contact Us</a>
          </li>
          <li>
            <a
              href="https://web.facebook.com/themandaraspa"
              rel="noreferrer"
              target="_blank"
              className="text-[#e0d8ad] transition hover:opacity-75"
            >
              <span className="sr-only">Instagram</span>

              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              href="https://www.instagram.com/themandaraspa/"
              rel="noreferrer"
              target="_blank"
              className="text-[#e0d8ad] transition hover:opacity-75"
            >
              <span className="sr-only">Twitter</span>

              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>

          
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
        <div>
          <p className="text-lg mt-5 font-semibold text-[#e0d8ad]">Locations</p>

          <ul className="mt-6 space-y-4 text-sm">
            <li>
              <a href="/user/locations/bgc_3rd" className="text-[#e0d8ad] transition hover:opacity-75"> BGC 3rd Avenue </a>
            </li>

            <li>
              <a href="/user/locations/bgc_one" className="text-[#e0d8ad] transition hover:opacity-75"> BGC One Serendra </a>
            </li>

            <li>
              <a href="/user/locations/greenhills" className="text-[#e0d8ad] transition hover:opacity-75"> Greenhills </a>
            </li>

            <li>
              <a href="/user/locations/bf" className="text-[#e0d8ad] transition hover:opacity-75"> BF Parañaque </a>
            </li>

            <li>
              <a href="/user/locations/camaya" className="text-[#e0d8ad] transition hover:opacity-75"> Camaya Coast, Bataan </a>
            </li>

            <li>
              <a href="/user/locations/s_maison" className="text-[#e0d8ad] transition hover:opacity-75"> S Maison at Conrad Manila, MOA Complex </a>
            </li>
          </ul>
        </div>

        <div>

          <ul className="mt-18 space-y-4 text-sm">
            <li>
              <a href="/user/locations/sm" className="text-[#e0d8ad] transition hover:opacity-75"> SM North Edsa </a>
            </li>

            <li>
              <a href="/user/locations/park_inn_north" className="text-[#e0d8ad] transition hover:opacity-75"> Park Inn by Radisson, North Edsa </a>
            </li>

            <li>
              <a href="venice" className="text-[#e0d8ad] transition hover:opacity-75"> Venice Grand Canal, Mckinley Hill, Taguig </a>
            </li>

            <li>
              <a href="/user/locations/park_inn_clark" className="text-[#e0d8ad] transition hover:opacity-75"> Park Inn by Radisson Clark, Pampanga </a>
            </li>

            <li>
              <a href="/user/locations/tagaytay" className="text-[#e0d8ad] transition hover:opacity-75"> Tagaytay Hillcrest </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg mt-5 font-semibold text-[#e0d8ad]">Services</p>

          <ul className="mt-6 space-y-4 text-sm">
            <li>
              <a href="/user/services/signature" className="text-[#e0d8ad] transition hover:opacity-75"> Signature Rituals </a>
            </li>

            <li>
              <a href="/user/services/hand_and_foot" className="text-[#e0d8ad] transition hover:opacity-75"> Hand and Foot Services </a>
            </li>

            <li>
              <a href="/user/services/face" className="text-[#e0d8ad] transition hover:opacity-75"> Face Rituals </a>
            </li>

            <li>
              <a href="/user/services/other" className="text-[#e0d8ad] transition hover:opacity-75"> Other Treats </a>
            </li>
          </ul>
        </div>

        <div>

          <ul className="mt-18 space-y-4 text-sm">
            <li>
              <a  className="text-[#e0d8ad]"> Body Rituals </a>
            </li>

            <li>
              <a href="/user/services/body/massage_therapy" className="text-[#e0d8ad] ml-4 transition hover:opacity-75"> Massage Therapy </a>
            </li>

            <li>
              <a href="/user/services/body/scrub_and_wraps" className="text-[#e0d8ad] ml-4 transition hover:opacity-75"> Scrub and Wraps </a>
            </li>

            <li>
              <a href="/user/services/body/healing_massage" className="text-[#e0d8ad] ml-4 transition hover:opacity-75">
                Healing Massage
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="flex">
        <p className="text-sm text-[#e0d8ad]">&copy; 2025. The Mandara Spa. All rights reserved. Powered by </p>
        <a target="_blank" rel="noreferrer" href="https://apexeldevelopment.com/?fbclid=IwZXh0bgNhZW0CMTEAAR3hqnud5A9vvZNNDy5XGnNh6dxFkM1Z6AaH9f7nZyMDcgeQCWzCJvQ8YiI_aem_Ij_lDZZcc9U_3IjhJIrNog" className="text-sm text-[#e0d8ad] ml-1 font-semibold transition-all hover:opacity-75">Apexel Development</a>
    </div>
  </div>
</footer>
)
}

export default Footer;