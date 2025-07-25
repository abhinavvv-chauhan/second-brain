import { iconSizeVariants} from "."
import type {IconProps} from "."

export const ViewIcon = ({size= "md"}:IconProps) => {
    return <svg  height="25px" width="25px" fill="currentColor" version="1.1" id="Layer_1" className={iconSizeVariants[size]} xmlns="http://www.w3.org/2000/svg"
    //@ts-ignore
	 viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<g id="view">
	<g>
		<path d="M12,21c-5,0-8.8-2.8-11.8-8.5L0,12l0.2-0.5C3.2,5.8,7,3,12,3s8.8,2.8,11.8,8.5L24,12l-0.2,0.5C20.8,18.2,17,21,12,21z
			 M2.3,12c2.5,4.7,5.7,7,9.7,7s7.2-2.3,9.7-7C19.2,7.3,16,5,12,5S4.8,7.3,2.3,12z"/>
	</g>
	<g>
		<path d="M12,17c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.8,17,12,17z M12,9c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,9,12,9z"/>
	</g>
</g>
</svg>
}