import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <nav class="navbar navbar-fixed-top affix-top" role="navigation" data-spy="affix" data-offset-top="100">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
						<span class="sr-only">Menu</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="/"><img style="height:80px; width: auto" src="img/logo-20lat.png" alt="Kubki.com.pl"/></a>
				</div>

				<div id="navbar" class="navbar-collapse collapse">

					<div class="navbar-right">
						<ul class="list-inline langs">
							<li><a href="?lang=1"><img src="img/pl.jpg" alt="pl"></a></li>
							<li><a href="?lang=2"><img src="img/en.jpg" alt="en"></a></li>
						</ul>

						<form action="/" method="get">
							<input type="text" name="search" value="szukaj" onclick="javascript:this.value='';"/>
						</form>
					</div>
					<ul class="navbar-nav nav navbar-right">
						<li class="active"><a href="/"><img src="img/home.png" alt=""/></a></li>
			<li>
				<a href="blog.html">Blog</a>
			</li>
			<li>
				<a href="/Kubki.html?lang=1">Oferta</a>
			</li>
			<li>
				<a href="O_firmie2.html">O firmie</a>
			</li>
			<li>
				<a href="ECO.html">ECO</a>
			</li>
			<li>
				<a href="Know_how.html">Strefa wiedzy</a>
			</li>
			<li>
				<a href="Kontakt.html">Kontakt</a>
			</li>
					</ul>
				</div>
			</div>
		</nav>
        {children}
        </body>
    </html>
  )
}
