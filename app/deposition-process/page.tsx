import HtmlFromTemplate from '@/components/StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

export default function metadata() {
  const lang = Cookies.get('i18nextLng') || 'en';

  return (
    <HtmlFromTemplate
      locale={lang}
      name="deposition-process"
      base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
    />
  );
}
