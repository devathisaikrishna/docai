<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactUs;

class ContactusMail extends Mailable
{
    public $contact;

    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(ContactUs $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->to('vasu.tamrakar@cssindiaonline.com', 'Vasu')
            ->subject('Contact Us Email')
            ->markdown('vendor.mail.contact.contactsend');
    }
}
