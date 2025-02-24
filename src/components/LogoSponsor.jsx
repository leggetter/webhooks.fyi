import Image from 'next/image'
import HookdeckLogo from '../../public/img/hookdeck.svg'

export function LogoSponsor() {
  return (
    <Image
      src={HookdeckLogo.src}
      alt="Hookdeck"
      layout="fixed"
      width={178}
      height={29}
      className="invert dark:invert-0"
    />
  )
}
