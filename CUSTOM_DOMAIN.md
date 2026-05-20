# Custom Domain Setup

This site is intended to be served with GitHub Pages. The screenshot shows the custom domain:

```text
www.indos-brainhack.com
```

GitHub says `DNS check unsuccessful` when the DNS records at the domain registrar do not yet point to GitHub Pages, or when the change has not propagated yet.

## Recommended Setup

Use the `www` domain as the main site:

```text
www.indos-brainhack.com
```

Then optionally redirect the bare domain:

```text
indos-brainhack.com -> www.indos-brainhack.com
```

## Step 1: Configure GitHub Pages

In the repository:

1. Go to `Settings`.
2. Go to `Pages`.
3. Under `Custom domain`, enter:

```text
www.indos-brainhack.com
```

4. Click `Save`.

GitHub may create or update a `CNAME` file automatically.

## Step 2: Configure DNS At The Domain Provider

Wherever `indos-brainhack.com` was purchased, open the DNS settings and add:

### For `www.indos-brainhack.com`

Create a `CNAME` record:

```text
Type:  CNAME
Name:  www
Value: karellopez.github.io
TTL:   Auto or default
```

Do not include the repository name in the value. Use `karellopez.github.io`, not `karellopez.github.io/INDoS_BrainHack`.

### Optional: For `indos-brainhack.com`

If you also want the bare domain to work, create these `A` records:

```text
Type:  A
Name:  @
Value: 185.199.108.153

Type:  A
Name:  @
Value: 185.199.109.153

Type:  A
Name:  @
Value: 185.199.110.153

Type:  A
Name:  @
Value: 185.199.111.153
```

Optional IPv6 records:

```text
Type:  AAAA
Name:  @
Value: 2606:50c0:8000::153

Type:  AAAA
Name:  @
Value: 2606:50c0:8001::153

Type:  AAAA
Name:  @
Value: 2606:50c0:8002::153

Type:  AAAA
Name:  @
Value: 2606:50c0:8003::153
```

## Step 3: Wait For DNS Propagation

DNS changes can take minutes, but sometimes up to 24 hours.

You can check from a terminal:

```bash
dig www.indos-brainhack.com +short
```

Expected result:

```text
karellopez.github.io.
```

For the bare domain:

```bash
dig indos-brainhack.com +short
```

Expected result includes GitHub Pages IPs such as:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## Step 4: Enable HTTPS

After GitHub's DNS check passes:

1. Return to `Settings -> Pages`.
2. Wait until GitHub provisions the certificate.
3. Enable `Enforce HTTPS`.

## Common Problems

- The domain has not been purchased yet.
- The DNS record points to the wrong target.
- The `CNAME` points to the repository path instead of `karellopez.github.io`.
- There is an old conflicting `A`, `AAAA`, or `CNAME` record.
- DNS propagation is still pending.
- A wildcard DNS record such as `*.indos-brainhack.com` is present; avoid this for GitHub Pages.
