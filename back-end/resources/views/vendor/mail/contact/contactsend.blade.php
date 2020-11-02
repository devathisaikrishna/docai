@component('mail::message')
<table align="center" class="container float-center">
    <tbody>
        <tr>
            <td><p>Name: {{$contact->name}}</p></td>
        </tr>
        <tr>
            <td><p>Email: {{$contact->email}}</p></td>
        </tr>
        <tr>
            <td><p>Phone: {{$contact->phone}}</p></td>
        </tr>
        <tr>
            <td colspan="3">
                <p>{{ $contact->message}}</p>
            </td>
        </tr>
    </tbody>
</table>
@endcomponent